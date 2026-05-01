'use client';

import { useMemo, useState } from 'react';

type PresetKey = 'fitness' | 'style' | 'grooming' | 'leader' | 'spiritual' | 'editorial';

type FormState = {
  subjectGender: string;
  approximateAge: string;
  bodyType: string;
  clothingStyle: string;
  goal: string;
  vibe: string;
  notes: string;
  enhancementStrength: 'subtle' | 'balanced' | 'strong';
  animeRealism: number;
  physiqueFocus: boolean;
  styleFocus: boolean;
  groomingFocus: boolean;
  postureFocus: boolean;
  keepIdentityHigh: boolean;
  studioBackground: boolean;
  fullBody: boolean;
  skinPolish: boolean;
  premiumLighting: boolean;
};

const BRAND = {
  name: 'FutureSelf Studio',
  tag: 'Luxury future-self portraits.',
};

const defaultState: FormState = {
  subjectGender: 'unspecified',
  approximateAge: '',
  bodyType: '',
  clothingStyle: '',
  goal: 'Create an aspirational anime-realism version of this person that still clearly looks like them.',
  vibe: 'confident, refined, elegant, believable',
  notes: '',
  enhancementStrength: 'balanced',
  animeRealism: 50,
  physiqueFocus: true,
  styleFocus: true,
  groomingFocus: true,
  postureFocus: true,
  keepIdentityHigh: true,
  studioBackground: true,
  fullBody: true,
  skinPolish: true,
  premiumLighting: true,
};

const presetConfigs: Record<PresetKey, Partial<FormState>> = {
  fitness: {
    goal: 'Look fitter, leaner, and stronger while keeping the same identity.',
    enhancementStrength: 'balanced',
    physiqueFocus: true,
    postureFocus: true,
    styleFocus: false,
    groomingFocus: false,
    animeRealism: 45,
  },
  style: {
    goal: 'Look more refined, fashionable, and modern.',
    enhancementStrength: 'balanced',
    physiqueFocus: false,
    postureFocus: true,
    styleFocus: true,
    groomingFocus: true,
    animeRealism: 50,
  },
  grooming: {
    goal: 'Improve grooming, facial sharpness, and polished presence.',
    enhancementStrength: 'subtle',
    physiqueFocus: false,
    postureFocus: false,
    styleFocus: true,
    groomingFocus: true,
    animeRealism: 35,
  },
  leader: {
    goal: 'Create a confident founder or leader presence with elevated style.',
    enhancementStrength: 'balanced',
    physiqueFocus: true,
    postureFocus: true,
    styleFocus: true,
    groomingFocus: true,
    animeRealism: 45,
  },
  spiritual: {
    goal: 'Create a serene, wise, elevated spiritual presence.',
    enhancementStrength: 'subtle',
    physiqueFocus: false,
    postureFocus: true,
    styleFocus: true,
    groomingFocus: true,
    animeRealism: 40,
  },
  editorial: {
    goal: 'Create a premium fashion-editorial anime realism portrait.',
    enhancementStrength: 'strong',
    physiqueFocus: true,
    postureFocus: true,
    styleFocus: true,
    groomingFocus: true,
    animeRealism: 65,
  },
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [usedPrompt, setUsedPrompt] = useState<string>('');
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);
  const [comparisonPosition, setComparisonPosition] = useState(50);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(preset: PresetKey) {
    setActivePreset(preset);
    setForm((prev) => ({ ...prev, ...presetConfigs[preset] }));
  }

  function handleImageChange(file?: File | null) {
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResultImage('');
    setUsedPrompt('');
    setError('');
    setComparisonPosition(50);
  }

  const promptPreview = useMemo(() => {
    const requested = [
      form.physiqueFocus ? 'fitness/physique improvement' : null,
      form.styleFocus ? 'style refinement' : null,
      form.groomingFocus ? 'grooming enhancement' : null,
      form.postureFocus ? 'posture & confidence' : null,
      form.skinPolish ? 'skin polish' : null,
      form.premiumLighting ? 'premium lighting' : null,
      form.studioBackground ? 'studio background' : null,
      form.fullBody ? 'full body' : 'portrait',
      form.keepIdentityHigh ? 'high identity match' : 'moderate identity match',
    ].filter(Boolean);

    return [
      'Reference: uploaded person photo.',
      `Goal: ${form.goal}`,
      `Vibe: ${form.vibe}`,
      `Strength: ${form.enhancementStrength}`,
      `Anime realism: ${form.animeRealism}%`,
      form.subjectGender !== 'unspecified' ? `Gender: ${form.subjectGender}` : null,
      form.approximateAge ? `Age range: ${form.approximateAge}` : null,
      form.bodyType ? `Body type: ${form.bodyType}` : null,
      form.clothingStyle ? `Clothing style: ${form.clothingStyle}` : null,
      requested.length ? `Focus: ${requested.join(', ')}` : null,
      form.notes ? `Notes: ${form.notes}` : null,
    ].filter(Boolean).join(' • ');
  }, [form]);

  async function generateImage() {
    if (!imageFile) {
      setError('Please upload a photo first.');
      return;
    }

    setLoading(true);
    setError('');
    setResultImage('');

    try {
      const payload = new FormData();
      payload.append('photo', imageFile);

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Generation failed.');
      }

      setResultImage(data.imageUrl || '');
      setUsedPrompt(data.prompt || '');
      setComparisonPosition(50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">F</div>
          <div>
            <div className="brand-name">{BRAND.name}</div>
            <div className="brand-tag">{BRAND.tag}</div>
          </div>
        </div>
        <div className="topbar-note">Premium anime-realism portrait generator</div>
      </header>

      <section className="hero-card">
        <div className="hero-copy">
          <div className="badge">Signature Edition</div>
          <h1>Craft an elevated, luxury version of someone’s future self.</h1>
          <p>
            A polished interface for premium transformations — fitness, grooming, posture, style, presence,
            and identity-preserving anime realism, all in one elegant workflow.
          </p>
          <div className="hero-points">
            <span>Elegant styling</span>
            <span>Premium lighting</span>
            <span>Identity preserved</span>
            <span>Luxury UI</span>
            <span>Before / after compare</span>
          </div>
        </div>
        <div className="hero-mini-card">
          <div className="mini-label">Ideal for</div>
          <ul>
            <li>Founder & personal branding</li>
            <li>Transformation inspiration</li>
            <li>Fashion and grooming concepts</li>
            <li>Vision boards and avatar creation</li>
          </ul>
        </div>
      </section>

      <section className="grid-layout">
        <div className="panel">
          <h2>1. Upload photo</h2>
          <label className="upload-box">
            {preview ? (
              <img src={preview} alt="Uploaded preview" className="preview-image" />
            ) : (
              <div>
                <strong>Click to upload</strong>
                <p>Portrait and full-body photos work best.</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />
          </label>

          <h2>2. Choose a preset</h2>
          <div className="preset-grid">
            {(
              [
                ['fitness', 'Fitness Upgrade'],
                ['style', 'Style Upgrade'],
                ['grooming', 'Grooming'],
                ['leader', 'Founder / Leader'],
                ['spiritual', 'Spiritual'],
                ['editorial', 'Editorial'],
              ] as [PresetKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                className={activePreset === key ? 'chip active' : 'chip'}
                onClick={() => applyPreset(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <h2>3. Customise the result</h2>
          <div className="form-grid">
            <div>
              <label>Gender presentation</label>
              <select value={form.subjectGender} onChange={(e) => update('subjectGender', e.target.value)}>
                <option value="unspecified">Unspecified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="androgynous">Androgynous</option>
              </select>
            </div>
            <div>
              <label>Approx age range</label>
              <input value={form.approximateAge} onChange={(e) => update('approximateAge', e.target.value)} placeholder="e.g. 35-45" />
            </div>
            <div>
              <label>Body type impression</label>
              <input value={form.bodyType} onChange={(e) => update('bodyType', e.target.value)} placeholder="e.g. lean, average" />
            </div>
            <div>
              <label>Desired clothing style</label>
              <input value={form.clothingStyle} onChange={(e) => update('clothingStyle', e.target.value)} placeholder="smart casual, elegant" />
            </div>
          </div>

          <div className="form-stack">
            <div>
              <label>Goal</label>
              <textarea value={form.goal} onChange={(e) => update('goal', e.target.value)} rows={3} />
            </div>
            <div>
              <label>Vibe</label>
              <input value={form.vibe} onChange={(e) => update('vibe', e.target.value)} placeholder="confident, refined, elegant, believable" />
            </div>
            <div>
              <label>Extra notes</label>
              <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={4} placeholder="keep turban style, premium watch, ivory background..." />
            </div>
          </div>

          <div className="form-stack">
            <div>
              <label>Enhancement strength</label>
              <div className="inline-buttons">
                {(['subtle', 'balanced', 'strong'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={form.enhancementStrength === level ? 'chip active' : 'chip'}
                    onClick={() => update('enhancementStrength', level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label>Anime realism: {form.animeRealism}%</label>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={form.animeRealism}
                onChange={(e) => update('animeRealism', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="toggle-grid">
            {[
              ['physiqueFocus', 'Fitness / physique'],
              ['styleFocus', 'Style refinement'],
              ['groomingFocus', 'Grooming'],
              ['postureFocus', 'Posture & presence'],
              ['skinPolish', 'Skin polish'],
              ['premiumLighting', 'Premium lighting'],
              ['keepIdentityHigh', 'Strong identity match'],
              ['studioBackground', 'Studio background'],
              ['fullBody', 'Full body output'],
            ].map(([key, label]) => (
              <label className="toggle-card" key={key}>
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={form[key as keyof FormState] as boolean}
                  onChange={(e) => update(key as keyof FormState, e.target.checked as never)}
                />
              </label>
            ))}
          </div>

          <button className="primary-button" onClick={generateImage} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Avatar'}
          </button>
          {error ? <p className="error-text">{error}</p> : null}
        </div>

        <div className="panel side-panel">
          <h2>Prompt preview</h2>
          <div className="prompt-box">{promptPreview}</div>

          <h2>Generated result</h2>
          {resultImage ? (
            <div className="result-stack">
              <img src={resultImage} alt="Generated result" className="result-image" />
              <a className="secondary-button" href={resultImage} download="futureself-avatar.png">
                Download image
              </a>
            </div>
          ) : (
            <div className="empty-state">Your generated avatar will appear here.</div>
          )}

          <h2>Before / after slider</h2>
          {preview && resultImage ? (
            <div className="compare-wrapper">
              <div className="compare-stage">
                <img src={preview} alt="Before" className="compare-image" />
                <div className="compare-overlay" style={{ width: `${comparisonPosition}%` }}>
                  <img src={resultImage} alt="After" className="compare-image overlay-image" />
                </div>
                <div className="compare-divider" style={{ left: `${comparisonPosition}%` }}>
                  <span>↔</span>
                </div>
                <div className="compare-label before">Before</div>
                <div className="compare-label after">After</div>
              </div>
              <input
                className="compare-range"
                type="range"
                min={0}
                max={100}
                value={comparisonPosition}
                onChange={(e) => setComparisonPosition(Number(e.target.value))}
              />
            </div>
          ) : (
            <div className="empty-state compact">Generate an image to unlock the before / after comparison slider.</div>
          )}

          {usedPrompt ? (
            <>
              <h2>Prompt used</h2>
              <div className="prompt-box">{usedPrompt}</div>
            </>
          ) : null}
        </div>
      </section>

      <footer className="footer">
        <div>{BRAND.name}</div>
        <div>Built with Next.js + OpenAI Images</div>
      </footer>
    </main>
  );
}
