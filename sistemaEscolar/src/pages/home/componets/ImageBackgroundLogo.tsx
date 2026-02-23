import schoolBg from "@/assets/school-bg.jpg";

export const ImageBackgroundLogo = () => {
  return (
    <div className="absolute inset-0">
      <img src={schoolBg} alt="" className="h-full w-full object-cover" />
      <div className="
        absolute 
        inset-0 
        bg-gradient-to-r 
        from-background-90 
        via-background-70 
        to-background-30 
        dark:from-background-95 
        dark:via-background-80 
        dark:to-background/40
      "
      />
    </div>
  );
};
