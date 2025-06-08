import React from "react";

interface D20Props {
    style: React.CSSProperties | undefined
}

const D20 = ({style}: D20Props) => {
    return (
        <svg style={style} viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">

            <polygon
                points="170,60 18,86 170,10 322,86 170,60 170,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <polygon
                points="170,332 280,240 322,256"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <polygon
                points="170,332 60,240 18,256"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <polygon
                points="60,240 280,240 170,60"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <polygon
                points="60,240 18,256 18,86"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <polygon
                points="280,240 322,256 322,86"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <text x="170" y="200" fontSize="60" fontWeight="bold" textAnchor="middle" fill="currentColor">20</text>
            <text x="170" y="200" fontSize="42" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(60 270 235)">14</text>
            <text x="170" y="200" fontSize="42" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(-60 70 235)">2</text>
            <text x="170" y="200" fontSize="24" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(-105 110 254)">12</text>
            <text x="170" y="200" fontSize="24" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(105 228 255)">6</text>
            <text x="170" y="200" fontSize="52" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(180 170 233)">8</text>
            <text x="170" y="200" fontSize="16" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(212 128 243)">10</text>
            <text x="170" y="200" fontSize="16" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(135 208 250)">16</text>
            <text x="170" y="200" fontSize="16" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(350 -680 320)">18</text>
            <text x="220" y="0" fontSize="16" fontWeight="bold" textAnchor="middle" fill="currentColor" transform="rotate(20 60 -20)">4</text>
        </svg>
    );
}
export default D20;