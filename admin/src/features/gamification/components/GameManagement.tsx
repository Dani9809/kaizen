"use client"; // In Game Management Table

import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Plus, Edit2, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { BackButton } from "@/components/ui/BackButton";
import EntityModal from "@/features/gamification/components/EntityModal";

interface GameManagementProps {
  entity: string;
}

const ENTITY_CONFIGS: Record<string, any> = {
  "pet": {
    title: "Pets",
    endpoint: "/admin/gamification/pet",
    columns: [
      { key: "pet_name", label: "Pet Name", bold: true },
      { key: "species.species_name", label: "Species" },
      { key: "pet_price", label: "Price", badge: true, variant: "secondary" },
      { key: "isForSale", label: "For Sale", boolean: true },
    ],
  },
  "species": {
    title: "Species",
    endpoint: "/admin/gamification/species",
    columns: [
      { key: "species_name", label: "Species Name", bold: true },
      { key: "category.species_category_name", label: "Category" },
      { key: "level.species_level_name", label: "Rarity/Level" },
      { key: "species_max_level", label: "Max Level" },
    ],
  },
  "species-level": {
    title: "Species Levels",
    endpoint: "/admin/gamification/species-level",
    columns: [
      { key: "species_level_name", label: "Level Name", bold: true },
      { key: "species_level_description", label: "Description" },
    ],
  },
  "species-category": {
    title: "Species Categories",
    endpoint: "/admin/gamification/species-category",
    columns: [
      { key: "species_category_name", label: "Category Name", bold: true },
      { key: "species_category_description", label: "Description" },
    ],
  },
  "shop-item": {
    title: "Shop Items",
    endpoint: "/admin/gamification/shop-item",
    columns: [
      { key: "item_name", label: "Item Name", bold: true },
      { key: "type.item_type_name", label: "Type" },
      { key: "item_price", label: "Price", badge: true, variant: "secondary" },
    ],
  },
  "shop-item-type": {
    title: "Shop Item Types",
    endpoint: "/admin/gamification/shop-item-type",
    columns: [
      { key: "item_type_name", label: "Type Name", bold: true },
      { key: "item_type_description", label: "Description" },
    ],
  },
  "quest": {
    title: "Quests",
    endpoint: "/admin/gamification/quest",
    columns: [
      { key: "title", label: "Quest Title", bold: true },
      { key: "type.quest_type_name", label: "Type" },
      { key: "reward_amount", label: "Reward", badge: true, variant: "success" },
    ],
  },
  "quest-type": {
    title: "Quest Types",
    endpoint: "/admin/gamification/quest-type",
    columns: [
      { key: "quest_type_name", label: "Type Name", bold: true },
      { key: "quest_type_description", label: "Description" },
    ],
  },
};

export default function GameManagement({ entity }: GameManagementProps) {
  const config = ENTITY_CONFIGS[entity];
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });

  const fetchData = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      const result = await apiFetch(config.endpoint);
      setData(result);
    } catch (err) {
      toast.error(`Failed to fetch ${config.title}`);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await apiFetch(`${config.endpoint}/${confirmDelete.id}`, { method: "DELETE" });
      toast.success(`${entity} deleted successfully`);
      fetchData();
      setConfirmDelete({ isOpen: false, id: null });
    } catch (err) {
      toast.error(`Deletion failed. This item might be in use.`);
    }
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const filteredData = data.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  if (!config) return <div>Entity config not found</div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BackButton />
          <h2 className="text-xl font-black tracking-tight text-foreground uppercase">{config.title}</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Input
            icon={Search}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            containerClassName="w-full sm:max-w-xs"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="primary" size="md" onClick={fetchData} className="flex-1 sm:flex-none">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="gradient" 
              size="md" 
              className="flex-1 sm:flex-none uppercase font-black"
              onClick={() => {
                setSelectedItem(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> New {entity.split('-').join(' ')}
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden" hover={false}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/5 border-b border-secondary/10">
                {config.columns.map((col: any) => (
                  <th key={col.key} className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">{col.label}</th>
                ))}
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/5">
              {filteredData.map((item, index) => (
                <tr key={item.id || item[`${entity.replace(/-/g, '_')}_id`] || index} className="hover:bg-secondary/5 transition-colors group">
                  {config.columns.map((col: any) => {
                    const val = getNestedValue(item, col.key);
                    return (
                      <td key={col.key} className="px-6 py-4">
                        {col.boolean ? (
                          <Badge variant={val ? "success" : "danger"} dot>
                            {val ? "Yes" : "No"}
                          </Badge>
                        ) : col.badge ? (
                          <Badge variant={col.variant || "neutral"}>
                            {val}
                          </Badge>
                        ) : (
                          <span className={`text-sm ${col.bold ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                            {val ?? "N/A"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-secondary/10 rounded-lg text-muted-foreground hover:text-secondary transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setConfirmDelete({ isOpen: true, id: item.id || item[`${entity.replace(/-/g, '_')}_id`] })}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length === 0 && !loading && (
            <div className="py-20 flex flex-col items-center justify-center text-foreground/30">
               <Search className="w-8 h-8 mb-4 opacity-20" />
               <p className="font-black text-xs uppercase tracking-widest">No records found</p>
            </div>
          )}
        </div>
      </Card>

      <EntityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        entity={entity}
        item={selectedItem}
      />

      <ConfirmationModal 
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action might fail if it's referenced by other entities."
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
