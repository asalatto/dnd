import './ExpandBox.css';
import { useState } from 'react';


export default function ExpandBox({height="50", children, ...props}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`expand-box ${expanded ? 'expanded' : 'collapsed'}`} {...props}>
            <div style={{ maxHeight: `${height}px` }}>
                {children}
            </div>
            <a onClick={() => setExpanded(!expanded)}>(see {expanded ? 'less' : 'more'})</a>
        </div>
    )
}