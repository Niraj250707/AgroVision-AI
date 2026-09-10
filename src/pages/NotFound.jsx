import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {

  return (
    <div className="py-16 text-center space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-canopy-100 text-canopy-900 flex items-center justify-center font-display font-bold text-2xl">
        404
      </div>
      <h2 className="font-display font-bold text-xl text-soil-950">
        Page Not Found
      </h2>
      <p className="text-xs text-soil-600">
        The requested page could not be located. You can navigate back to the overview dashboard.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canopy-900 text-white text-xs font-bold hover:bg-canopy-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
