import { Component, ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

/**
 * Genel amaçlı Error Boundary.
 *
 * Döküman "Error Handling" bölümündeki pattern ile birebir aynı:
 * - Class component olmak ZORUNDA (functional component'te bu API yok)
 * - getDerivedStateFromError -> render sırasında fallback UI göstermek için
 * - componentDidCatch -> loglama / Sentry-Datadog'a göndermek için
 *
 * ÖNEMLİ SINIRLAMA: Error Boundary sadece render sırasında throw edilen
 * hataları yakalar. Promise reject (ör. next/dynamic'in import() başarısız
 * olması) render throw'u DEĞİLDİR ve boundary'ye düşmez; bu senaryo için
 * ayrı bir yükleme stratejisi gerekebilir.
 */
export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Gerçek projede: Sentry.captureException(error, { extra: errorInfo })
		console.error('ErrorBoundary caught:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="error-box">
						<strong>Something went wrong</strong>
						<p style={{ margin: '6px 0 0' }}>{this.state.error?.message}</p>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
