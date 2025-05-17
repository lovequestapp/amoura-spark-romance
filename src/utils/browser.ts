
interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  touch: boolean;
  userAgent: string;
}

export function detectBrowser(): BrowserInfo {
  const userAgentData = navigator.userAgent;
  let browser = "Unknown";
  let version = "Unknown";
  let os = "Unknown";
  
  // Extract browser name and version
  if (userAgentData.indexOf("Firefox") > -1) {
    browser = "Firefox";
    version = userAgentData.match(/Firefox\/([0-9.]+)/)![1];
  } else if (userAgentData.indexOf("SamsungBrowser") > -1) {
    browser = "Samsung Internet";
    version = userAgentData.match(/SamsungBrowser\/([0-9.]+)/)![1];
  } else if (userAgentData.indexOf("Opera") > -1 || userAgentData.indexOf("OPR") > -1) {
    browser = "Opera";
    version = userAgentData.indexOf("Opera") > -1 
      ? userAgentData.match(/Opera\/([0-9.]+)/)![1] 
      : userAgentData.match(/OPR\/([0-9.]+)/)![1];
  } else if (userAgentData.indexOf("Edg") > -1) {
    browser = "Microsoft Edge";
    version = userAgentData.match(/Edg\/([0-9.]+)/)![1];
  } else if (userAgentData.indexOf("Chrome") > -1) {
    browser = "Chrome";
    version = userAgentData.match(/Chrome\/([0-9.]+)/)![1];
  } else if (userAgentData.indexOf("Safari") > -1) {
    browser = "Safari";
    version = userAgentData.match(/Version\/([0-9.]+)/)![1];
  } else if (userAgentData.indexOf("Trident") > -1) {
    browser = "Internet Explorer";
    version = userAgentData.match(/rv:([0-9.]+)/)![1];
  }
  
  // Extract OS
  if (userAgentData.indexOf("Win") > -1) {
    os = "Windows";
  } else if (userAgentData.indexOf("Mac") > -1) {
    os = "MacOS";
  } else if (userAgentData.indexOf("Linux") > -1) {
    os = "Linux";
  } else if (userAgentData.indexOf("Android") > -1) {
    os = "Android";
  } else if (userAgentData.indexOf("iOS") > -1 || userAgentData.indexOf("iPhone") > -1 || userAgentData.indexOf("iPad") > -1) {
    os = "iOS";
  }
  
  // Detect device type
  const mobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentData);
  const tablet = /iPad|tablet|Tablet/i.test(userAgentData);
  const desktop = !mobile && !tablet;
  
  // Detect touch capability
  const touch = ('ontouchstart' in window) || 
    (navigator.maxTouchPoints > 0) || 
    // @ts-ignore - Not all browsers support this
    (navigator.msMaxTouchPoints > 0);
  
  return {
    name: browser,
    version,
    os,
    mobile,
    tablet,
    desktop,
    touch,
    userAgent: userAgentData
  };
}

export function applyBrowserSpecificFixes(): void {
  const browser = detectBrowser();
  
  // Add browser info to HTML element for CSS targeting
  document.documentElement.classList.add(`browser-${browser.name.toLowerCase().replace(/\s+/g, '-')}`);
  
  if (browser.mobile) {
    document.documentElement.classList.add('is-mobile');
  } else if (browser.tablet) {
    document.documentElement.classList.add('is-tablet');
  } else if (browser.desktop) {
    document.documentElement.classList.add('is-desktop');
  }
  
  if (browser.touch) {
    document.documentElement.classList.add('has-touch');
  }
  
  // Safari specific fixes for flexbox issues
  if (browser.name === 'Safari') {
    const style = document.createElement('style');
    style.textContent = `
      /* Fix for Safari flexbox gap issues */
      @supports (-webkit-touch-callout: none) {
        .safari-flex-gap {
          display: flex;
          gap: 0 !important;
        }
        .safari-flex-gap > * + * {
          margin-left: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Internet Explorer specific polyfills
  if (browser.name === 'Internet Explorer') {
    console.warn('Internet Explorer is not fully supported. Please use a modern browser for the best experience.');
    // Load polyfills if needed
  }
}
