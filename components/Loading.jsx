import React from 'react'

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="grid grid-cols-3 gap-1.5">
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        className="w-4 h-4 rounded-sm bg-orange-500"
                        style={{
                            animation: `gridWave 1.5s ease-in-out infinite`,
                            animationDelay: `${i * 0.17}s`,
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes gridWave {
                    0%, 100% { opacity: 0.15; transform: scale(0.8); }
                    50%       { opacity: 1;    transform: scale(1);   }
                }
            `}</style>
        </div>
    )
}

export default Loading
