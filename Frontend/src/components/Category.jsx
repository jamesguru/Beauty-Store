const Category = () => {
  return (
    <div className="flex items-center m-3">
      <div className="relative bg-[url('/serum.jpg')] bg-no-repeat bg-cover bg-center bg-slate-300 h-[500px] w-[400px] flex items-center justify-center m-[20px]">
        <div className="absolute inset-0 bg-gradient-to-1 from-black/50 to-transparent" />
        <div className="relative flex items-center justify-center">
          <h2 className="font-semibold text-[30px] text-white">Serums</h2>
        </div>
      </div>
      <div className="relative bg-[url('/serum1.jpg')] bg-no-repeat bg-cover bg-center bg-slate-300 h-[500px] w-[400px] flex items-center justify-center m-[20px]">
        <div className="absolute inset-0 bg-gradient-to-1 from-black/50 to-transparent" />
        <div className="relative flex items-center justify-center">
          <h2 className="font-semibold text-[30px] text-white">Toners</h2>
        </div>
      </div>
      <div className="relative bg-[url('/lotion.jpg')] bg-no-repeat bg-cover bg-center bg-slate-300 h-[500px] w-[400px] flex items-center justify-center m-[20px]">
        <div className="absolute inset-0 bg-gradient-to-1 from-black/50 to-transparent" />
        <div className="relative flex items-center justify-center">
          <h2 className="font-semibold text-[30px] text-white">Lotions</h2>
        </div>
      </div>
      <div className="relative bg-[url('/foundation.jpg')] bg-no-repeat bg-cover bg-center bg-slate-300 h-[500px] w-[400px] flex items-center justify-center m-[20px]">
        <div className="absolute inset-0 bg-gradient-to-1 from-black/50 to-transparent" />
        <div className="relative flex items-center justify-center">
          <h2 className="font-semibold text-[30px] text-white">Foundation</h2>
        </div>
      </div>
    </div>
  );
};

export default Category;
