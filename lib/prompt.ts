export type AvatarForm = {
  subjectGender: string;
  approximateAge: string;
  bodyType: string;
  clothingStyle: string;
  goal: string;
  vibe: string;
  notes: string;
  enhancementStrength: string;
  animeRealism: string;
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

export function buildPrompt(form: AvatarForm) {
  const improvements = [
    form.physiqueFocus ? "improve physique in a believable inspirational way" : null,
    form.styleFocus ? "upgrade clothing, styling, and silhouette" : null,
    form.groomingFocus ? "refine grooming, beard or hair presentation, and facial neatness" : null,
    form.postureFocus ? "improve posture and overall confidence" : null,
    form.skinPolish ? "slightly polish skin and facial definition while keeping realism" : null,
    form.premiumLighting ? "use premium clean editorial lighting" : null,
    form.studioBackground ? "place the person in a clean premium minimal studio background" : null,
    form.fullBody ? "use a full-body composition" : "use a portrait or three-quarter composition",
    form.keepIdentityHigh ? "maintain a strong recognizable identity match" : "allow a moderate amount of creative interpretation"
  ]
    .filter(Boolean)
    .join(", ");

  const extra: string[] = [];
  if (form.subjectGender && form.subjectGender !== "unspecified") {
    extra.push(`gender presentation: ${form.subjectGender}`);
  }
  if (form.approximateAge) {
    extra.push(`approximate age range: ${form.approximateAge}`);
  }
  if (form.bodyType) {
    extra.push(`current body type impression: ${form.bodyType}`);
  }
  if (form.clothingStyle) {
    extra.push(`current or desired clothing style: ${form.clothingStyle}`);
  }

  return [
    "Use the uploaded photo as the identity reference for the person.",
    "First understand the person's approximate age range, body shape, grooming, and overall visual impression from the reference image.",
    "Then create an enhanced anime-realism transformation of the same person.",
    extra.length ? `Identity notes: ${extra.join('; ')}.` : null,
    `Primary goal: ${form.goal || 'Create an aspirational anime-realism version of this person that still clearly looks like them.'}`,
    `Overall vibe: ${form.vibe || 'confident, refined, believable'}.`,
    `Enhancement strength: ${form.enhancementStrength || 'balanced'}.`,
    `Anime realism intensity: ${form.animeRealism || '50'}%.`,
    `Requested improvements: ${improvements}.`,
    form.notes ? `Extra instructions: ${form.notes}` : null,
    "Keep the result flattering, tasteful, aspirational, premium, and believable.",
    "Do not turn the person into someone else. Preserve key facial identity, cultural markers, and overall recognizability.",
    "The final result should look like a polished inspirational future-self portrait in anime realism trend style."
  ]
    .filter(Boolean)
    .join(' ');
}
