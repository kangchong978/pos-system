import React from 'react';

interface LogoPreviewProps {
    logo: string | File | null;
}

const LogoPreview: React.FC<LogoPreviewProps> = ({ logo }) => {
    const [preview, setPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (logo instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(logo);
        } else if (typeof logo === 'string') {
            setPreview('http://localhost:6001' + logo);
        } else {
            setPreview(null);
        }
    }, [logo]);

    if (!preview) {
        return <div style={{
            width: '100px',
            height: '100px',
            border: '1px dashed #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
        }}>No Logo</div>;
    }

    return <img src={preview} alt="Company Logo" style={{
        maxWidth: '100px',
        maxHeight: '100px',
        objectFit: 'contain',
    }} />;
};

export default LogoPreview;