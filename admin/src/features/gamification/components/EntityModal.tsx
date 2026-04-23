"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entity: string;
  item?: any;
}

const FIELD_CONFIGS: Record<string, any[]> = {
  "pet": [
    { name: "pet_name", label: "Pet Name", type: "text", required: true },
    { name: "species_id", label: "Species", type: "select", optionsEndpoint: "/admin/gamification/species", optionLabel: "species_name", optionValue: "species_id", required: true },
    { name: "pet_price", label: "Price", type: "number", required: true, presets: [0, 100, 500, 1000, 5000] },
    { name: "pet_description", label: "Description", type: "textarea" },
    { name: "isForSale", label: "For Sale", type: "checkbox" },
  ],
  "species": [
    { name: "species_name", label: "Species Name", type: "text", required: true },
    { name: "species_category_id", label: "Category", type: "select", optionsEndpoint: "/admin/gamification/species-category", optionLabel: "species_category_name", optionValue: "species_category_id", required: true },
    { name: "species_level_id", label: "Level/Rarity", type: "select", optionsEndpoint: "/admin/gamification/species-level", optionLabel: "species_level_name", optionValue: "species_level_id", required: true },
    { name: "species_max_level", label: "Max Level", type: "number", required: true },
  ],
  "species-level": [
    { name: "species_level_name", label: "Level Name", type: "text", required: true },
    { name: "species_level_description", label: "Description", type: "textarea" },
  ],
  "species-category": [
    { name: "species_category_name", label: "Category Name", type: "text", required: true },
    { name: "species_category_description", label: "Description", type: "textarea" },
  ],
  "shop-item": [
    { name: "item_name", label: "Item Name", type: "text", required: true },
    { name: "shop_item_type_id", label: "Type", type: "select", optionsEndpoint: "/admin/gamification/shop-item-type", optionLabel: "item_type_name", optionValue: "shop_item_type_id", required: true },
    { name: "item_price", label: "Price", type: "number", required: true, presets: [0, 50, 100, 250, 500] },
    { name: "item_description", label: "Description", type: "textarea" },
  ],
  "shop-item-type": [
    { name: "item_type_name", label: "Type Name", type: "text", required: true },
    { name: "item_type_description", label: "Description", type: "textarea" },
  ],
  "quest": [
    { name: "title", label: "Quest Title", type: "text", required: true },
    { name: "quest_type_id", label: "Type", type: "select", optionsEndpoint: "/admin/gamification/quest-type", optionLabel: "quest_type_name", optionValue: "quest_type_id", required: true },
    { name: "reward_amount", label: "Reward Amount", type: "number", required: true, presets: [10, 50, 100, 200, 500] },
    { name: "description", label: "Description", type: "textarea" },
  ],
  "quest-type": [
    { name: "quest_type_name", label: "Type Name", type: "text", required: true },
    { name: "quest_type_description", label: "Description", type: "textarea" },
  ],
  "mood": [
    { name: "mood_label", label: "Mood Label", type: "text", required: true },
    { name: "mood_description", label: "Description", type: "textarea", required: true },
  ],
};

export default function EntityModal({ isOpen, onClose, onSuccess, entity, item }: EntityModalProps) {
  const fields = FIELD_CONFIGS[entity] || [];
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchOptions = async () => {
      const selectFields = fields.filter(f => f.type === "select");
      const newOptions: Record<string, any[]> = {};

      for (const field of selectFields) {
        try {
          const data = await apiFetch(field.optionsEndpoint);
          newOptions[field.name] = data;
        } catch (err) {
          console.error(`Failed to fetch options for ${field.name}`);
        }
      }
      setOptions(newOptions);
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen, fields]);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = `/admin/gamification/${entity}`;
    const method = item ? "PATCH" : "POST";
    const idField = `${entity.replace(/-/g, '_')}_id`;
    const url = item ? `${endpoint}/${item[idField] || item.id}` : endpoint;

    try {
      // Clean data for API (convert strings to numbers if needed)
      const submissionData = { ...formData };
      fields.forEach(f => {
        if ((f.type === "number" || f.type === "select") && submissionData[f.name]) {
          submissionData[f.name] = Number(submissionData[f.name]);
        }
      });

      await apiFetch(url, {
        method,
        body: JSON.stringify(submissionData),
      });

      toast.success(`${entity} ${item ? 'updated' : 'created'} successfully`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(`Failed to save ${entity}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${item ? 'Edit' : 'New'} ${entity.replace(/-/g, ' ').toUpperCase()}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="w-full bg-secondary/5 border border-secondary/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/30 transition-all min-h-[100px]"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              />
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-3 p-3 bg-secondary/5 border border-secondary/10 rounded-xl">
                <input 
                  type="checkbox"
                  className="w-4 h-4 rounded border-secondary/20 text-secondary focus:ring-secondary"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                />
                <span className="text-xs font-bold">{field.label}</span>
              </div>
            ) : field.type === "select" ? (
              <div className="relative group/select">
                <select
                  className="w-full bg-secondary/5 border border-secondary/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/30 transition-all appearance-none pr-10"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {options[field.name]?.map((opt: any) => (
                    <option key={opt[field.optionValue]} value={opt[field.optionValue]}>
                      {opt[field.optionLabel]}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover/select:text-secondary transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="bg-secondary/5 border-secondary/10"
                />
                {field.presets && (
                  <div className="flex flex-wrap gap-1.5 ml-1">
                    {field.presets.map((preset: number) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleChange(field.name, preset)}
                        className={`
                          px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all
                          ${Number(formData[field.name]) === preset 
                            ? "bg-secondary border-secondary text-white shadow-sm shadow-secondary/20" 
                            : "bg-secondary/5 border-secondary/10 text-muted-foreground hover:border-secondary/30 hover:text-secondary"}
                        `}
                      >
                        {preset === 0 ? "Free" : preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="primary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" className="flex-1 font-black uppercase" loading={loading}>
            {item ? 'Save Changes' : 'Create Entity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
