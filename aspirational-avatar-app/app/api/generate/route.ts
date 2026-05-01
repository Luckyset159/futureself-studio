import { NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function bool(value: FormDataEntryValue | null) {
  return String(value) === 'true';
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY. Add it in your deployment environment variables.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const photo = formData.get('photo');

    if (!(photo instanceof File)) {
      return NextResponse.json({ error: 'No photo uploaded.' }, { status: 400 });
    }

    const prompt = buildPrompt({
      subjectGender: String(formData.get('subjectGender') || 'unspecified'),
      approximateAge: String(formData.get('approximateAge') || ''),
      bodyType: String(formData.get('bodyType') || ''),
      clothingStyle: String(formData.get('clothingStyle') || ''),
      goal: String(formData.get('goal') || ''),
      vibe: String(formData.get('vibe') || ''),
      notes: String(formData.get('notes') || ''),
      enhancementStrength: String(formData.get('enhancementStrength') || 'balanced'),
      animeRealism: String(formData.get('animeRealism') || '50'),
      physiqueFocus: bool(formData.get('physiqueFocus')),
      styleFocus: bool(formData.get('styleFocus')),
      groomingFocus: bool(formData.get('groomingFocus')),
      postureFocus: bool(formData.get('postureFocus')),
      keepIdentityHigh: bool(formData.get('keepIdentityHigh')),
      studioBackground: bool(formData.get('studioBackground')),
      fullBody: bool(formData.get('fullBody')),
      skinPolish: bool(formData.get('skinPolish')),
      premiumLighting: bool(formData.get('premiumLighting')),
    });

    const outbound = new FormData();
    outbound.append('model', 'gpt-image-1');
    outbound.append('prompt', prompt);
    outbound.append('size', bool(formData.get('fullBody')) ? '1024x1536' : '1024x1024');
    outbound.append('quality', 'high');
    outbound.append('image', photo, photo.name || 'upload.png');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: outbound,
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'OpenAI image generation failed.';
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const base64 = data?.data?.[0]?.b64_json;
    if (!base64) {
      return NextResponse.json({ error: 'No image was returned by the provider.' }, { status: 500 });
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${base64}`,
      prompt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
