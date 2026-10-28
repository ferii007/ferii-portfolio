import '@/app/globals.css';
import '@/design-system/css/appearance.css';
import '@/components/typography/typography.css';
import '@/features/projects/projects.css';
import '@/features/portfolio/portfolio.css';
import '@/features/contact/contact.css';
import '@/features/robot/robot.css';
import '@/features/skills/skills.css';
import '@/features/chat/chat.css';
import '@/app/responsive.css';
import '@/components/layout/footer.css';
import { getLocalization } from '@/constants/localization';
import { THEME } from '@/constants/site';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ErrorReporter from './ErrorReporter';

// Vercel's Analytics and Speed Insights scripts are served by Vercel itself, so they only load on Vercel builds.
const onVercel = Boolean(process.env.VERCEL);

const themeTokens = { '--color-canvas': THEME.canvas, '--color-heading': THEME.heading };

// Shared <html> for both root layouts, app/(id) and app/(en). Stylesheet order matters, so it lives here once.
export default function RootDocument({ language, children }) {
  return <html lang={getLocalization(language).locale} style={themeTokens}><body className="feri-theme">
    {/* Shared organic paper edge used by .fp-paper::before. */}
    <svg className="fp-visually-hidden" aria-hidden="true" focusable="false"><filter id="fp-paper-edge" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7" /><feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G" /></filter><filter id="fp-paper-torn" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="4" seed="11" /><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    {children}
    <ErrorReporter />
    {onVercel && <><Analytics /><SpeedInsights /></>}
  </body></html>;
}
