import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}

export function Callout({ type, title, message }: CalloutProps) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          borderColor: 'var(--primary)',
          iconColor: 'var(--primary)',
          icon: CheckCircle
        };
      case 'error':
        return {
          borderColor: 'var(--destructive)',
          iconColor: 'var(--destructive)',
          icon: XCircle
        };
      case 'warning':
        return {
          borderColor: '#f59e0b', // Orange pour warning
          iconColor: '#f59e0b',
          icon: AlertTriangle
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <div
      className="p-6 border-l-4 mt-6"
      style={{
        borderColor: styles.borderColor,
        backgroundColor: 'var(--card)',
      }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          <Icon className="w-6 h-6" style={{ color: styles.iconColor }} />
        </div>
        <div className="flex-1">
          <h3 
            className="mb-2"
            style={{
              color: 'var(--foreground)',
              fontSize: 'var(--text-h4)',
              fontWeight: 'var(--font-weight-medium)',
              lineHeight: '1.5'
            }}
          >
            {title}
          </h3>
          <p 
            style={{
              color: 'var(--foreground)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: '1.5'
            }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
