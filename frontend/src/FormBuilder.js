import React, { useState } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([{ name: '', label: '', type: 'text' }]);

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    try {
      await axios.post('http://localhost:3000/forms', {
        title,
        description,
        fields,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Form created!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Create New Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <input
          type="text"
          placeholder="Form Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="space-y-2">
          <h3 className="font-bold">Fields</h3>
          {fields.map((field, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].label = e.target.value;
                  newFields[index].name = e.target.value.toLowerCase().replace(/ /g, '_');
                  setFields(newFields);
                }}
                className="flex-1 p-2 border rounded"
              />
              <select
                value={field.type}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].type = e.target.value;
                  setFields(newFields);
                }}
                className="p-2 border rounded"
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={addField} className="text-blue-500 underline">
            + Add Field
          </button>
        </div>

        <button type="submit" className="bg-green-500 text-white p-2 rounded px-4">
          Save Form
        </button>
      </form>
    </div>
  );
};

export default FormBuilder;
