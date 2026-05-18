const LEVEL_ORDER = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };

export const computeMatchScore = (currentUser, candidate) => {
  let score = 0;
  const reasons = [];

  for (const offered of currentUser.offeredSkills || []) {
    for (const requested of candidate.requestedSkills || []) {
      if (offered.name.toLowerCase() === requested.name.toLowerCase()) {
        score += 30;
        reasons.push(`You teach ${offered.name}, they want to learn it`);
        const diff = Math.abs((LEVEL_ORDER[offered.level] || 1) - (LEVEL_ORDER[requested.level] || 1));
        if (diff <= 1) { score += 15; reasons.push('Compatible skill levels'); }
      }
    }
  }

  for (const requested of currentUser.requestedSkills || []) {
    for (const offered of candidate.offeredSkills || []) {
      if (requested.name.toLowerCase() === offered.name.toLowerCase()) {
        score += 30;
        reasons.push(`You want ${requested.name}, they can teach it`);
      }
    }
  }

  if (currentUser.location && candidate.location &&
      currentUser.location.toLowerCase() === candidate.location.toLowerCase()) {
    score += 10;
    reasons.push('Same location');
  }

  const currentDays = new Set((currentUser.availability || []).map((a) => a.day));
  const overlap = (candidate.availability || []).filter((a) => currentDays.has(a.day));
  if (overlap.length) {
    score += 10 + overlap.length * 2;
    reasons.push('Overlapping availability');
  }

  const langOverlap = (currentUser.languages || []).filter((l) =>
    (candidate.languages || []).map((x) => x.toLowerCase()).includes(l.toLowerCase())
  );
  if (langOverlap.length) {
    score += 5;
    reasons.push('Shared languages');
  }

  score += Math.min(candidate.trustScore / 10, 10);
  return { score, reasons: [...new Set(reasons)] };
};
