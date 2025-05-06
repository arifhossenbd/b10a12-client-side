// For initial load animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const scrollYAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
  };

  const scrollLeftAnimation = {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
  };

  const scrollRightAnimation = {
    initial: { opacity: 0, x: 200 },
    whileInView: { opacity: 1, x: 0 },
  };

  export {containerVariants, scrollYAnimation, scrollLeftAnimation, scrollRightAnimation}