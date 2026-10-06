import { ResponsiveContainer } from 'recharts';

export default function ChartContainer({ children, height = 300, className = '', ...props }) {
    return (
        <div className={`w-full ${className}`} {...props}>
            <ResponsiveContainer width="100%" height={height}>
                {children}
            </ResponsiveContainer>
        </div>
    );
}