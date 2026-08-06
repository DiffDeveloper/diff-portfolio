// Reference-counted body scroll lock. Multiple overlays (command palette,
// game mode) can lock simultaneously; scrolling resumes only when every
// lock is released. Prevents one overlay "restoring" another's lock state.
let locks = 0;

export const lockScroll = () => {
  locks += 1;
  document.body.style.overflow = "hidden";
};

export const unlockScroll = () => {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.overflow = "auto";
  }
};
