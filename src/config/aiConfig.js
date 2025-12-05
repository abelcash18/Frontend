export const isClaudeHaikuEnabled = () => {
  // Vite exposes env vars that start with VITE_
  try {
    return import.meta.env.VITE_ENABLE_CLAUDE_HAIKU_45 === 'true' || import.meta.env.VITE_ENABLE_CLAUDE_HAIKU_45 === true;
  } catch (e) {
    return false;
  }
};
