"use client";

import { motion } from "framer-motion";

export default function Hobbies() {
  const hobbies = ["Gymnastics", "Music", "Yoga", "Traveling"];

  return (
    <section id="hobbies" className="py-20 lg:py-32 bg-[#0f0520]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full lg:ml-24">
        {/* Section Header */}
        <motion.div 
          className="flex items-end mb-12"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Number 5 - SVG with violet colors */}
          <svg 
            width="71" 
            height="95" 
            viewBox="0 0 71 95" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="-mr-2"
          >
            <g filter="url(#filter0_d_5_hobbies)">
              <path d="M4.63948 76.9411C3.87143 76.263 3.79082 75.1056 4.41983 74.2968L11.1188 65.6839C11.8723 64.715 13.3095 64.6522 14.2153 65.4804C16.3271 67.4115 18.613 68.9447 21.0729 70.08C24.2729 71.52 27.7929 72.24 31.6329 72.24C36.4329 72.24 40.3129 71.16 43.2729 69C46.2329 66.76 47.7129 63.68 47.7129 59.76C47.7129 56.16 46.3129 53.12 43.5129 50.64C40.7129 48.16 36.7529 46.92 31.6329 46.92C28.5129 46.92 25.5929 47.48 22.8729 48.6C20.655 49.5409 18.4936 50.8206 16.3887 52.4391C15.6713 52.9907 14.6775 53.0392 13.9362 52.5203L8.90464 48.9982C8.33775 48.6014 8.01626 47.9397 8.05465 47.2488L10.408 4.88906C10.4668 3.82923 11.3434 3 12.4049 3H56.8729C57.9775 3 58.8729 3.89543 58.8729 5V16C58.8729 17.1046 57.9775 18 56.8729 18H25.8442C24.783 18 23.9066 18.8288 23.8474 19.8884L23.0762 33.6841C22.9881 35.2594 24.6953 36.3427 26.1701 35.7819C27.1953 35.392 28.2562 35.0647 29.3529 34.8C31.6729 34.24 34.0729 33.96 36.5529 33.96C41.9129 33.96 46.6729 35.04 50.8329 37.2C55.0729 39.36 58.3929 42.4 60.7929 46.32C63.2729 50.16 64.5129 54.8 64.5129 60.24C64.5129 65.92 63.0729 70.8 60.1929 74.88C57.3929 78.88 53.6329 81.92 48.9129 84C44.1929 86.08 38.9529 87.12 33.1929 87.12C27.0329 87.12 21.4729 86.16 16.5129 84.24C12.176 82.5337 8.21818 80.1007 4.63948 76.9411Z" fill="#5227FF"/>
              <path d="M56.8725 2.5C58.2532 2.5 59.3725 3.61929 59.3725 5V16C59.3725 17.3807 58.2532 18.5 56.8725 18.5H25.8442C25.0484 18.5 24.3907 19.1215 24.3461 19.916L23.5756 33.7119C23.5109 34.8699 24.8022 35.7671 25.9926 35.3145C27.038 34.9169 28.1192 34.584 29.2358 34.3145C31.5956 33.7448 34.0352 33.46 36.5531 33.46C41.9815 33.46 46.8223 34.5541 51.0629 36.7559H51.0619C55.3765 38.9543 58.7643 42.0528 61.2133 46.0488L61.4477 46.4199C63.832 50.2807 65.0131 54.895 65.0131 60.2402C65.0131 66.0078 63.5486 70.9908 60.602 75.166C57.7466 79.2452 53.9134 82.3433 49.1147 84.458C44.3241 86.5691 39.0141 87.6201 33.1928 87.6201C26.9807 87.6201 21.3583 86.6516 16.3324 84.7061L16.3295 84.7051C11.9374 82.977 7.93005 80.5133 4.30901 77.3164C3.33332 76.455 3.24219 74.9969 4.02483 73.9902L10.724 65.377C11.6722 64.1579 13.451 64.1035 14.5531 65.1113C16.6291 67.0095 18.8721 68.5134 21.2826 69.626C24.4111 71.033 27.859 71.7402 31.6332 71.7402C36.3598 71.7402 40.1267 70.6763 42.978 68.5957C45.8005 66.4567 47.2133 63.5303 47.2133 59.7598C47.2132 56.3092 45.8786 53.4039 43.1811 51.0146C40.5016 48.6414 36.6762 47.42 31.6332 47.4199C28.5745 47.4199 25.7189 47.9689 23.0629 49.0625C20.8897 49.9851 18.7668 51.242 16.6938 52.8359C15.8134 53.5128 14.5803 53.5809 13.6498 52.9297L8.6176 49.4082C7.90901 48.9122 7.50712 48.0843 7.5551 47.2207L9.90862 4.86133C9.98221 3.5366 11.078 2.50009 12.4047 2.5H56.8725Z" stroke="#B19EEF"/>
            </g>
            <defs>
              <filter id="filter0_d_5_hobbies" x="0" y="0" width="70.5129" height="94.1201" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dx="1" dy="2"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.322 0 0 0 0 0.153 0 0 0 0 1 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5_hobbies"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5_hobbies" result="shape"/>
              </filter>
            </defs>
          </svg>
          {/* Title text with line */}
          <div className="flex items-start mb-1 -mt-4">
            <h2 className="font-sans font-semibold text-[32px] leading-none tracking-[-0.02em] text-[#F9F9F9] whitespace-nowrap ml-2">
              Hobbies
            </h2>
            {/* Line */}
            <div className="w-[417px] h-[1px] bg-[#5227FF]/50 hidden lg:block ml-3 mt-[16px]" />
          </div>
        </motion.div>

        {/* Vertical list of hobbies */}
        <div className="space-y-4 ml-[90px]">
          {hobbies.map((hobby, index) => (
            <motion.div 
              key={index} 
              className="bg-[#1a0a2e] border-l-4 border-[#5227FF] px-6 py-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ x: 10, borderColor: "#FF9FFC" }}
            >
              <h3 className="text-[#FF9FFC] font-sans font-semibold text-xl">
                {hobby}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
