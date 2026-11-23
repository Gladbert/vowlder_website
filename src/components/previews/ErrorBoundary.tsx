import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; label: string };
type State = { failed: boolean };

/**
 * If a template throws, the guest should still get a way back to the catalogue
 * instead of a blank phone screen. React error boundaries only work in class
 * components, so this is the one class in the project.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nothing to report to a server in a static build; keep it in the console for
    // whoever is debugging, with enough context to reproduce.
    console.error(`${this.props.label} failed to render`, error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#FBF9F5] px-6 text-center">
        <p className="text-[11px] tracking-[0.16em] uppercase text-[#6F5B3E]">
          This invitation could not load
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-[#5C574F]">
          Something broke on our side, not yours. Reload the page, or head back to the catalogue.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <a
            href="/themes"
            className="flex min-h-[44px] items-center rounded-pill bg-[#1A1917] px-5 text-sm font-medium text-[#FBF9F5]"
          >
            Back to the themes
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex min-h-[44px] items-center rounded-pill border border-[#E3DCD1] px-5 text-sm font-medium"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
