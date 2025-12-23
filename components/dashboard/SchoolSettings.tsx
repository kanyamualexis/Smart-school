
import React, { useState } from 'react';
import { Settings, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '../../services/db';
import { User } from '../../types';

export const SchoolSettings = ({ user }: { user: User }) => {
  const [school, setSchool] = useState(db.getSchool(user.school_id));
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(school?.name || '');

  const handleSave = () => {
    db.updateSchool(user.school_id, { name });
    setSchool(db.getSchool(user.school_id));
    setEdit(false);
  };

  if (!school) return null;

  return (
    <div className="max-w-2xl bg-white rounded-xl shadow-sm border p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings /> School Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
          <div className="flex gap-2">
            <input 
              disabled={!edit} 
              value={edit ? name : school.name} 
              onChange={e => setName(e.target.value)}
              className="flex-1 border p-2 rounded bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
            {edit ? (
              <Button onClick={handleSave} size="sm">Save</Button>
            ) : (
              <Button variant="outline" onClick={() => setEdit(true)} size="sm"><Edit size={16} /></Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded border">
            <div className="text-xs text-gray-500 uppercase font-bold">Current Plan</div>
            <div className="text-lg font-bold capitalize text-brand-600">{school.plan}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded border">
            <div className="text-xs text-gray-500 uppercase font-bold">Nursery Support</div>
            <div className="text-lg font-bold">{school.has_nursery ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
