/**
 * Theme — Single import point
 *
 * Usage:
 *   import { colors, typography, spacing } from "../theme";
 *   // or
 *   import theme from "../theme";
 *
 *   <div style={{ color: theme.colors.text.primary }}>
 *   <button style={{ background: theme.colors.accent }}>
 */

import colors from "./colors.js";
import typography from "./typography.js";
import spacing from "./spacing.js";

export { colors, typography, spacing };

const theme = {
  colors,
  typography,
  spacing,
  radius: {
    sm: "2px",
    md: "3px",
    lg: "4px",
    full: "9999px",
  },
  border: `1px solid ${colors.border}`,
};

export default theme;