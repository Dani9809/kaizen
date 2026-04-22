import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // PETS
  async getAllPets() {
    return this.prisma.pet.findMany({
      include: { species: { include: { category: true, level: true } } },
      orderBy: { pet_id: 'desc' }
    });
  }

  async getPetById(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { pet_id: id },
      include: { species: { include: { category: true, level: true } } }
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  async createPet(data: any) {
    return this.prisma.pet.create({ data });
  }

  async updatePet(id: number, data: any) {
    return this.prisma.pet.update({ where: { pet_id: id }, data });
  }

  async deletePet(id: number) {
    return this.prisma.pet.delete({ where: { pet_id: id } });
  }

  // SPECIES
  async getAllSpecies() {
    return this.prisma.species.findMany({
      include: { category: true, level: true },
      orderBy: { species_id: 'desc' }
    });
  }

  async createSpecies(data: any) {
    return this.prisma.species.create({ data });
  }

  async updateSpecies(id: number, data: any) {
    return this.prisma.species.update({ where: { species_id: id }, data });
  }

  async deleteSpecies(id: number) {
    return this.prisma.species.delete({ where: { species_id: id } });
  }

  // SPECIES LEVEL
  async getAllSpeciesLevels() {
    return this.prisma.speciesLevel.findMany({ orderBy: { species_level_id: 'desc' } });
  }

  async createSpeciesLevel(data: any) {
    return this.prisma.speciesLevel.create({ data });
  }

  async updateSpeciesLevel(id: number, data: any) {
    return this.prisma.speciesLevel.update({ where: { species_level_id: id }, data });
  }

  async deleteSpeciesLevel(id: number) {
    return this.prisma.speciesLevel.delete({ where: { species_level_id: id } });
  }

  // SPECIES CATEGORY
  async getAllSpeciesCategories() {
    return this.prisma.speciesCategory.findMany({ orderBy: { species_category_id: 'desc' } });
  }

  async createSpeciesCategory(data: any) {
    return this.prisma.speciesCategory.create({ data });
  }

  async updateSpeciesCategory(id: number, data: any) {
    return this.prisma.speciesCategory.update({ where: { species_category_id: id }, data });
  }

  async deleteSpeciesCategory(id: number) {
    return this.prisma.speciesCategory.delete({ where: { species_category_id: id } });
  }

  // SHOP ITEM TYPE
  async getAllShopItemTypes() {
    return this.prisma.shopItemType.findMany({ orderBy: { shop_item_type_id: 'desc' } });
  }

  async createShopItemType(data: any) {
    return this.prisma.shopItemType.create({ data });
  }

  async updateShopItemType(id: number, data: any) {
    return this.prisma.shopItemType.update({ where: { shop_item_type_id: id }, data });
  }

  async deleteShopItemType(id: number) {
    return this.prisma.shopItemType.delete({ where: { shop_item_type_id: id } });
  }

  // SHOP ITEM
  async getAllShopItems() {
    return this.prisma.shopItem.findMany({
      include: { type: true },
      orderBy: { shop_item_id: 'desc' }
    });
  }

  async createShopItem(data: any) {
    return this.prisma.shopItem.create({ data });
  }

  async updateShopItem(id: number, data: any) {
    return this.prisma.shopItem.update({ where: { shop_item_id: id }, data });
  }

  async deleteShopItem(id: number) {
    return this.prisma.shopItem.delete({ where: { shop_item_id: id } });
  }

  // QUEST TYPE
  async getAllQuestTypes() {
    return this.prisma.questType.findMany({ orderBy: { quest_type_id: 'desc' } });
  }

  async createQuestType(data: any) {
    return this.prisma.questType.create({ data });
  }

  async updateQuestType(id: number, data: any) {
    return this.prisma.questType.update({ where: { quest_type_id: id }, data });
  }

  async deleteQuestType(id: number) {
    return this.prisma.questType.delete({ where: { quest_type_id: id } });
  }

  // QUEST
  async getAllQuests() {
    return this.prisma.quest.findMany({
      include: { type: true },
      orderBy: { quest_id: 'desc' }
    });
  }

  async createQuest(data: any) {
    return this.prisma.quest.create({ data });
  }

  async updateQuest(id: number, data: any) {
    return this.prisma.quest.update({ where: { quest_id: id }, data });
  }

  async deleteQuest(id: number) {
    return this.prisma.quest.delete({ where: { quest_id: id } });
  }
}
