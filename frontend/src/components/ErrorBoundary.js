import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez logger l'erreur ici
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h2>Quelque chose s'est mal passé.</h2>
            <p>Veuillez réessayer ultérieurement.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
}
}

export default ErrorBoundary;