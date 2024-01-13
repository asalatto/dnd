import * as React from 'react';
import './ExpandBox.css';

export default function ExpandBox({height="50", children, ...props}) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <div className={`expand-box ${expanded ? 'expanded' : 'collapsed'}`} {...props}>
            <div style={{ maxHeight: `${height}px` }}>
                {children}
            </div>
            {
                expanded ? 
                    <a onClick={() => setExpanded(false)}>(see less)</a> 
                : 
                    <a onClick={() => setExpanded(true)}>(see more)</a>
            }
        </div>
    )
}