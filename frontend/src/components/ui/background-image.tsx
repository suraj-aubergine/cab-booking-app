export function BackgroundImage() {
  return (
    <>
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/background.jpg")', // Make sure to add the image to public folder
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7) blur(1px)',
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-0" /> {/* Overlay */}
    </>
  );
} 