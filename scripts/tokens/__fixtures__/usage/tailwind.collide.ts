// Two theme sections with the same key: `rounded-surface` and `translate-x-surface` both end in
// "-surface", and the same holds for `duration-short2` and `delay-short2`.
const config = {
  theme: {
    extend: {
      borderRadius: { surface: "var(--sk-radius-surface)" },
      translate: { surface: "var(--motion-distance-surface)" },
      transitionDuration: { short2: "var(--motion-duration-short2)" },
      transitionDelay: { short2: "var(--motion-delay-short2)" },
    },
  },
};
export default config;
