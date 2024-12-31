document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const links = document.querySelectorAll("nav a");
  const navbar = document.querySelector("nav");
  const navbarHeight = navbar.offsetHeight;

  window.addEventListener("scroll", () => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
        // Section is at or below the navbar
        let linkColor = "white";
        if (["projects", "reviews"].includes(section.id)) {
          linkColor = "black";
        }

        links.forEach((link) => {
          if (link.href.includes(section.id)) {
            if (["projects", "reviews"].includes(section.id)) {
              link.style.color = "#c11582";
            } else {
              link.style.color = "#f670d4";
            }
          } else {
            link.style.color = linkColor;
          }
        });
      }
    });
  });

  // Add animation classes to elements when they come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Stop observing once the element is in view
          setTimeout(() => {
            // Remove animation classes after the animation has played
            entry.target.classList.remove(
              "slide-down",
              "slide-up",
              "slide-left",
              "slide-right",
              "visible"
            );
          }, 1000);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Select elements to animate
  const elementsToAnimate = document.querySelectorAll(
    ".slide-down, .slide-up, .slide-left, .slide-right"
  );
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });

  // Stagger animations in groups
  const observerGroup = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll(".scale-in");
          elements.forEach((element, index) => {
            setTimeout(() => {
              element.classList.add("visible");
            }, index * 100); // Adjust this value to change the stagger effect
          });
          observerGroup.unobserve(entry.target);
          setTimeout(() => {
            elements.forEach((element) => {
              element.classList.remove("visible", "scale-in");
            });
          }, elements.length * 100 + 1000); // Adjust this value to match the total duration of the stagger effect
        }
      });
    },
    { threshold: 0.15 }
  );

  // Select groups of elements to animate
  const animationGroups = document.querySelectorAll(".group-animation");
  animationGroups.forEach((group) => {
    observerGroup.observe(group);
  });
});
