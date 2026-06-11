/* Inline SVG icons. Lucide-style stroke icons; design-system iconography spec. */

const Icon = ({ name, size = 20, strokeWidth = 2, className = "icon" }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    pencil: <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></>,
    arrow:  <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowL: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    grid:   <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    list:   <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    cube:   <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    lock:   <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    home:   <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z"/></>,
    radio:  <><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49"/><path d="M7.76 16.24a6 6 0 0 1 0-8.49"/><path d="M20.07 3.93a10 10 0 0 1 0 16.14"/><path d="M3.93 20.07a10 10 0 0 1 0-16.14"/></>,
    cloud:  <><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></>,
    cloudoff: <><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6"/><path d="M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    check:  <><polyline points="20 6 9 17 4 12"/></>,
    users:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    open:   <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    info:   <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    alert:  <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    db:     <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    eye:    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    edit:   <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><polygon points="18.5 2.5 21.5 5.5 12 15 9 15 9 12 18.5 2.5"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    cpu:    <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/></>,
    book:   <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    chevR:  <><polyline points="9 18 15 12 9 6"/></>,
    chevL:  <><polyline points="15 18 9 12 15 6"/></>,
    plus:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:  <><line x1="5" y1="12" x2="19" y2="12"/></>,
    fit:    <><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></>,
    x:      <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    trash:  <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>,
    pin:    <><path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2.5"/></>,
    link:   <><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    inbox:  <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    pullrequest: <><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></>,
    checkcircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    xcircle: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>,
    mail:   <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    comment: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    sort:   <><path d="M11 5h10"/><path d="M11 9h7"/><path d="M11 13h4"/><path d="m3 17 3 3 3-3"/><path d="M6 18V4"/></>,
  };
  return (
    <svg className={className}
         width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// Category illustrations for placeholder thumbnails.
// We do not have device photos; render a quiet line glyph of the category instead.
const CategoryGlyph = ({ category, size = 40 }) => {
  const glyphs = {
    // Hubs, routers and bridges
    hubs:          <><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="7" y1="11" x2="7" y2="13"/><line x1="11" y1="11" x2="11" y2="13"/><circle cx="17" cy="12" r="1" fill="currentColor"/></>,
    // Buttons, switches and controls
    controls:      <><rect x="5" y="4" width="14" height="16" rx="2"/><circle cx="12" cy="9" r="2"/><line x1="12" y1="13" x2="12" y2="16"/></>,
    // Cameras and NVRs
    cameras:       <><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
    // Cleaning
    cleaning:      <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></>,
    // Climate control
    climate:       <><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></>,
    // Irrigation
    irrigation:    <><path d="M12 3c-3 4-5 7-5 10a5 5 0 0 0 10 0c0-3-2-6-5-10z"/><path d="M10 14a2 2 0 0 0 2 2"/></>,
    // Kitchen and household
    kitchen:       <><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="8" y1="6" x2="8" y2="6"/><line x1="12" y1="6" x2="12" y2="6"/><line x1="11" y1="14" x2="13" y2="14"/></>,
    // Lighting
    lighting:      <><circle cx="12" cy="9" r="6"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="10" y1="23" x2="14" y2="23"/></>,
    // Occupancy, presence and motion
    presence:      <><circle cx="12" cy="7" r="3"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/></>,
    // Pool and spa
    pool:          <><path d="M2 17c2 0 2-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/><path d="M2 21c2 0 2-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/><path d="M7 13V5h3"/><path d="M17 13V5h-3"/></>,
    // Pets
    pets:          <><circle cx="6" cy="10" r="1.6"/><circle cx="10" cy="6" r="1.6"/><circle cx="14" cy="6" r="1.6"/><circle cx="18" cy="10" r="1.6"/><path d="M12 11c-3 0-5 3-5 5a2.5 2.5 0 0 0 4 2c.5-.3 1.5-.3 2 0a2.5 2.5 0 0 0 4-2c0-2-2-5-5-5z"/></>,
    // Power and energy
    power:         <><path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/></>,
    // Security and access control
    security:      <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    // Sensors (generic — concentric pulses)
    sensors:       <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="11"/></>,
    // Entertainment
    entertainment: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></>,
    // Vehicles and mobility
    vehicles:      <><path d="M3 14l2-6h14l2 6"/><rect x="3" y="14" width="18" height="5" rx="1"/><circle cx="7" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></>,
    // Wearables
    wearables:     <><rect x="8" y="6" width="8" height="12" rx="1.5"/><line x1="10" y1="3" x2="14" y2="3"/><line x1="10" y1="21" x2="14" y2="21"/></>,
    // Window treatments and shading
    shading:       <><rect x="4" y="3" width="16" height="14"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round">
      {glyphs[category] || glyphs.hubs}
    </svg>
  );
};

window.Icon = Icon;

// Real protocol logos, provided by the project owner for compatibility
// listings. Rendered with currentColor so they follow the theme; the Wi-Fi
// wordmark's knockout uses --proto-knockout (set to the chip background).
const PROTOCOL_LOGOS = {
  zigbee: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 300 300\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M28.3047 62.5498C85.8145 52.5823 142.522 52.8903 195.082 56.0703C194.818 56.344 55.8987 200.585 45.1279 209.872C48.8404 233.654 65.5648 247.035 80.4297 249.638C144.427 260.768 236.144 249.975 265.185 246.037C237.667 279 196.297 300 150 300C67.155 300 2.57691e-07 232.845 0 150C0 117.33 10.5597 87.1873 28.3047 62.5498Z\" fill=\"currentColor\"></path><path d=\"M150 0C232.845 0 300 67.155 300 150C300 179.775 291.217 207.458 276.255 230.798C276.262 230.588 276.27 230.445 276.277 230.228C181.882 246.577 100.125 237.75 100.125 237.75C100.125 237.75 231.308 102.48 251.745 81.2998C246.915 67.1774 244.777 52.7254 210.315 43.4404C171.675 33.0229 86.1675 38.4298 42.375 45.6523C69.6375 17.5349 107.745 5.33417e-05 150 0Z\" fill=\"currentColor\"></path></svg>",
  wifi: "<svg width=\"20\" height=\"14\" viewBox=\"0 0 300 208\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M150.385 0C117.15 0 87.5473 15.6286 68.5204 39.9303H50.7042C22.7484 39.9303 0 62.6641 0 90.62V121.185C0 149.141 22.7484 171.889 50.7042 171.889H71.7874C90.8471 193.907 118.998 207.841 150.385 207.841C181.771 207.841 209.922 193.907 228.982 171.889H249.281C277.248 171.889 300 149.141 300 121.185V90.62C300 62.6641 277.248 39.9303 249.281 39.9303H232.249C213.222 15.6286 183.62 0 150.385 0Z\" fill=\"currentColor\"></path><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M249.28 49.6836C271.853 49.6837 290.233 68.0536 290.233 90.626V121.182C290.233 143.754 271.853 162.124 249.28 162.124C249.28 162.124 173.742 162.124 136.07 162.124C148.699 152.896 156.921 137.981 156.921 121.182V90.626C156.921 68.0535 175.291 49.6836 197.863 49.6836H249.28ZM179.959 137.039H198.156V116.827H233.271V101.35H198.156V86.5967H237.008V71.043H179.959V137.039ZM247.58 137.039H264.542V89.0986H247.58V137.039ZM256.061 67.3711C250.504 67.3711 246.345 70.7614 246.345 75.5811C246.345 80.7477 250.504 83.9648 256.061 83.9648C261.899 83.9648 265.949 80.7477 265.949 75.5811C265.949 70.7614 261.898 67.3711 256.061 67.3711Z\" fill=\"var(--proto-knockout)\"></path><path d=\"M46.3428 82.0811C47.8591 91.4175 49.6567 102.92 50.3066 110.74C51.0649 103.007 53.1343 91.5903 55.2139 82.1562L57.4668 71.043H74.2549L76.5186 82.1562C78.5874 91.5903 80.6567 103.007 81.4258 110.74C82.0757 102.92 83.8734 91.4175 85.3789 82.0811L87.166 71.043H105.84L90.0908 137.039H73.2158L70.1934 122.709C68.0379 112.538 66.0559 100.18 65.6768 95.3818C65.2868 100.18 63.3156 112.538 61.1602 122.709L58.127 137.039H41.4473L25.709 71.043H44.5557L46.3428 82.0811Z\" fill=\"var(--proto-knockout)\"></path><path d=\"M130.86 137.039H113.888V89.0996H130.86V137.039Z\" fill=\"var(--proto-knockout)\"></path><path d=\"M122.379 67.3711C128.217 67.3711 132.269 70.7621 132.269 75.582C132.268 80.7485 128.217 83.9648 122.379 83.9648C116.812 83.9647 112.663 80.7483 112.663 75.582C112.663 70.7622 116.812 67.3713 122.379 67.3711Z\" fill=\"var(--proto-knockout)\"></path></svg>",
  zwave: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 300 301\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M256.691 230.27L239.636 257.964H165.443L206.59 194.267H168.575L184.416 168.917H256.691L218.101 230.27H256.691ZM214.296 129.718C166.961 129.718 128.589 168.059 128.589 215.358C128.589 262.656 166.961 301 214.296 301C261.627 301 300 262.656 300 215.358C300 168.059 261.627 129.718 214.296 129.718ZM212.346 28.1786V0C94.984 0.518981 0 95.7255 0 213.121C0 213.656 0.037098 214.183 0.0423977 214.718H28.16C28.5018 112.664 110.541 29.8891 212.346 28.1786ZM212.346 86.9526V58.7926C212.131 58.79 211.922 58.7741 211.707 58.7741C125.871 58.7741 56.2855 128.307 56.2855 214.079C56.2855 214.294 56.3014 214.505 56.3014 214.717H84.4826C85.6698 144.673 142.247 88.1389 212.346 86.9526Z\" fill=\"currentColor\"></path></svg>",
  thread: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 300 300\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M149.996 0C232.709 0 300 67.2877 300 149.993C300 222.073 248.889 282.424 181.002 296.751V150.131L197.542 150.133C224.691 150.133 246.782 128.044 246.782 100.896C246.782 73.7474 224.691 51.6602 197.542 51.6602C170.398 51.6602 148.314 73.7474 148.314 100.896V117.435L99.2197 117.428C66.6035 117.428 40.0674 143.971 40.0674 176.597C40.0676 209.207 66.6036 235.743 99.2197 235.743V203.053C84.6327 203.053 72.758 191.184 72.7578 176.597C72.7578 161.995 84.6326 150.122 99.2197 150.122L148.314 150.125V299.949C66.3819 299.042 0.000230751 232.14 0 149.993C0 67.2878 67.2871 0.000149886 149.996 0Z\" fill=\"currentColor\"></path><path d=\"M197.542 84.3545C206.666 84.3546 214.087 91.7765 214.087 100.896C214.087 110.018 206.666 117.438 197.542 117.438L181.002 117.437V100.896C181.002 91.7765 188.424 84.3545 197.542 84.3545Z\" fill=\"currentColor\"></path></svg>",
  matter: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 300 293\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M265.247 132.716C232.973 141.549 204.04 162.587 185.99 193.829C167.939 225.071 164.166 260.653 172.646 292.996L204.27 274.741C201.71 258.707 203.244 242.286 208.731 227.003L282.632 269.631L300 259.6V239.567L226.099 196.943C236.603 184.549 250.069 175.006 265.247 169.197V132.716ZM34.7407 132.716V169.197C49.92 175.004 63.3859 184.548 73.889 196.943L0 239.571V259.604L17.3683 269.635L91.2573 227.007C96.8678 242.608 98.224 259.023 95.7296 274.745L127.342 293C135.822 260.653 132.052 225.075 113.998 193.833C96.6964 163.798 68.2024 141.826 34.7407 132.716ZM149.994 0L132.626 10.0187V95.2749C116.295 92.3266 101.401 85.2884 89.0172 75.2656L57.3804 93.5043C81.1746 117.019 113.889 131.534 149.998 131.534C186.107 131.534 218.821 117.019 242.616 93.5043L210.991 75.2656C198.368 85.4981 183.364 92.3805 167.37 95.2749V10.0187L149.994 0Z\" fill=\"currentColor\"></path></svg>",
  bluetooth: "<svg width=\"12\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 7L17 17L12 22V2L17 7L7 17\"></path></svg>",
  ethernet: "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4 8H20V15H15V19H9V15H4Z\"></path><path d=\"M7.5 8V11M10 8V11M14 8V11M16.5 8V11\"></path></svg>",
};
// Matter is an application layer that rides on a radio; both transport-specific
// options reuse the Matter mark.
PROTOCOL_LOGOS.matterThread = PROTOCOL_LOGOS.matter;
PROTOCOL_LOGOS.matterWifi = PROTOCOL_LOGOS.matter;
const ProtocolGlyph = ({ name, className = "proto-glyph" }) => {
  const svg = PROTOCOL_LOGOS[name];
  if (!svg) return null;
  return <span className={className + " proto-glyph-" + name} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
};

window.CategoryGlyph = CategoryGlyph;
window.ProtocolGlyph = ProtocolGlyph;

// Ecosystem "logos". Real brand marks (full-colour SVG/PNG provided by the
// project owner) render as <img>; any ecosystem without a registered logo
// falls back to a tinted monogram tile so the column always reads as a logo
// column, consistent with the protocol list.
const ECOSYSTEM_LOGOS = {
  homeAssistant: "assets/ecosystems/homeassistant.svg",
  amazonAlexa:   "assets/ecosystems/amazonalexa.svg",
  appleHome:     "assets/ecosystems/applehome.svg",
  googleHome:    "assets/ecosystems/googlehome.svg",
  homey:         "assets/ecosystems/homey.png",
  smartThings:   "assets/ecosystems/smartthings.svg",
};
const ECOSYSTEM_MARKS = {
  homeAssistant: { mono: "HA", color: "#18bcf2" },
  amazonAlexa:   { mono: "AA", color: "#1ba7c4" },
  appleHome:     { mono: "AH", color: "#5b6470" },
  googleHome:    { mono: "GH", color: "#3f7fd0" },
  homey:         { mono: "Hy", color: "#d44a39" },
  smartThings:   { mono: "ST", color: "#2f6fc4" },
};
// Free-text "other" ecosystems have no registered mark; derive a monogram from
// the label (first letters of the first two words, else first two characters).
function ecoMonogram(label) {
  const parts = String(label || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return String(label || "?").replace(/\s+/g, "").slice(0, 2).toUpperCase() || "?";
}
const EcoGlyph = ({ name, label, on = true }) => {
  const logo = ECOSYSTEM_LOGOS[name];
  if (logo) {
    return (
      <span className={"eco-glyph eco-glyph-img" + (on ? "" : " eco-glyph-off")} aria-hidden="true">
        <img src={logo} alt="" width="24" height="24" loading="lazy" />
      </span>);
  }
  const mark = ECOSYSTEM_MARKS[name];
  const mono = mark ? mark.mono : ecoMonogram(label);
  const style = { "--eco-tile": mark ? mark.color : "var(--neutral-400)" };
  return (
    <span className={"eco-glyph" + (on ? "" : " eco-glyph-off")} style={style} aria-hidden="true">{mono}</span>);
};

window.EcoGlyph = EcoGlyph;
