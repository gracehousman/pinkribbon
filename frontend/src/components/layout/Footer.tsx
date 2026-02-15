import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center space-x-2 mb-4">
             <svg width="24" height="24" viewBox="-1.37 1.172 406.495 406.495" xmlns="http://www.w3.org/2000/svg">
               <g fill="#E91E63" stroke="#ffffff" strokeWidth="2">
                 <path d="M151.036 14.728c25.248-10.863 49.059-12.879 83.902-2.032 4.07 4.166-3.577 48.009-3.577 48.009-30.696-14.182-48.263-17.126-78.959 3.312.001 0-12.595-39.276-1.366-49.289z"/>
                 <path d="M148.884 15.616c15.829-18.318 83.555-16.483 100.39-3.109s27.662 100.138-4.28 73.443c-31.942-26.695-57.746-26.199-94.475 5.068 0 0-17.464-57.083-1.635-75.402z"/>
                 <path d="M253.848 21.385s-4.317-35.721 22.636 63.323c26.955 99.044-137.336 313.352-154.053 313.352l-81.177-33.15C222.173 204.117 258.487 48.529 253.848 21.385z"/>
                 <path d="M144.968 29.993s4.907-35.721-25.729 63.323C88.604 192.36 275.333 406.667 294.333 406.667l68.308-56.148C200.202 251.725 139.696 57.137 144.968 29.993z"/>
               </g>
             </svg>
             <span className="font-bold text-lg tracking-tight">
               <span className="text-[#E91E63]">Pink</span>
               <span className="text-[#00BFB3]">Ribbon</span>
             </span>
          </Link>
          <p className="text-slate-500 text-sm max-w-sm mb-4">
            See How Breast Cancer Treatment Plans Affect Your Long-Term Outcomes.
            Compare probability distributions, cost estimates, and real-world success rates.
          </p>
          <div className="text-xs text-slate-400 bg-slate-100 p-3 rounded-lg border border-slate-200">
            <strong>Disclaimer:</strong> This is an educational simulator based on probabilistic models and historical CMS data. 
            It is not medical advice. Always consult your licensed physician for treatment decisions.
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-900 mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/simulate" className="hover:text-[#E91E63] transition-colors">Simulate Treatments</Link></li>
            <li><Link to="/find-centers" className="hover:text-[#00BFB3] transition-colors">Find Centers</Link></li>
            <li><Link to="/profile" className="hover:text-[#00BFB3] transition-colors">My Health Profile</Link></li>
            <li><Link to="/compare" className="hover:text-[#00BFB3] transition-colors">Comparisons</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-3">About</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/about" className="hover:text-[#00BFB3] transition-colors">About Us</Link></li>
            <li><Link to="/data-sources" className="hover:text-[#00BFB3] transition-colors">Data Sources (CMS)</Link></li>
            <li><Link to="/methodology" className="hover:text-[#00BFB3] transition-colors">Methodology</Link></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-2">
        <span>© 2026 PinkRibbon Inc. · Created for TreeHacks 2026</span>
        <span className="flex items-center gap-2 mt-2 md:mt-0">
           <span className="w-2 h-2 bg-green-500 rounded-full"></span> HIPAA Compliant (Local Storage Only)
        </span>
      </div>
    </footer>
  );
}
