// This  hero section is called hero because its designed to grab attention

export const Hero = () => {
  return (
    <section className="text-center bg-amber-50 border-slate-300 px-6 py-20 ">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Comfortable Cabs across Uttarakhand
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
        Experienced hill drivers for Char Dham, Haridwar, Rishikesh and more.
      </p>
      <a
        href="#routes"
        className="mt-8 inline-block rounded-lg bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-800"
      >
        See routes
      </a>
    </section>
  );
};
