import { CheckCircle, XCircle } from 'lucide-react';

interface CalloutProps {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export function Callout({ type, title, message }: CalloutProps) {
  const isSuccess = type === 'success';

  return (
    <div
      className="p-6 border-l-4 mt-6"
      style={{
        borderColor: isSuccess ? 'var(--primary)' : 'var(--destructive)',
        backgroundColor: 'var(--card)',
      }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-1">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6" style={{ color: 'var(--primary)' }} />
          ) : (
            <XCircle className="w-6 h-6" style={{ color: 'var(--destructive)' }} />
          )}
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
