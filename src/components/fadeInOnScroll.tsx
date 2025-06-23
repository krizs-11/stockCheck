import { ReactNode, useEffect, useRef, useState } from 'react';
interface FadeInOnScrollProps {
    children: ReactNode;
    className?: string;
}

const FadeInOnScroll = ({ children, className = '' }: FadeInOnScrollProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
                else {
                    // setIsVisible(false); // remove this line if you only want it to animate once
                }
            },
            {
                threshold: 0.2, // adjust as needed
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`
        transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default FadeInOnScroll;
