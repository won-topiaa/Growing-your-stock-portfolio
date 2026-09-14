import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AddHoldingForm } from '../components/forms/AddHoldingForm';

export function AddHolding() {
  return (
    <div className="max-w-md mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <h1 className="text-xl font-bold text-slate-800 mb-6">Add New Holding</h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <AddHoldingForm />
      </div>
    </div>
  );
}
