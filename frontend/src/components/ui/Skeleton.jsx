const Skeleton = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={`animate-pulse bg-white/5 rounded-md ${className}`} 
        />
      ))}
    </>
  );
};

export default Skeleton;
