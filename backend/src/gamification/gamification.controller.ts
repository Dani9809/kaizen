import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreatePetDto } from './dto/pet.dto';
import { CreateSpeciesDto, CreateSpeciesLevelDto, CreateSpeciesCategoryDto } from './dto/pet.dto';
import { CreateShopItemDto, CreateShopItemTypeDto } from './dto/shop.dto';
import { CreateQuestDto, CreateQuestTypeDto } from './dto/quest.dto';

@Controller('admin/gamification')
@UseGuards(AdminGuard)
export class GamificationController {
  constructor(private readonly service: GamificationService) {}

  // PETS
  @Get('pet')
  getAllPets() { return this.service.getAllPets(); }

  @Get('pet/:id')
  getPet(@Param('id', ParseIntPipe) id: number) { return this.service.getPetById(id); }

  @Post('pet')
  createPet(@Body() dto: CreatePetDto) { return this.service.createPet(dto); }

  @Patch('pet/:id')
  updatePet(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreatePetDto>) {
    return this.service.updatePet(id, dto);
  }

  @Delete('pet/:id')
  deletePet(@Param('id', ParseIntPipe) id: number) { return this.service.deletePet(id); }

  // SPECIES
  @Get('species')
  getAllSpecies() { return this.service.getAllSpecies(); }

  @Post('species')
  createSpecies(@Body() dto: CreateSpeciesDto) { return this.service.createSpecies(dto); }

  @Patch('species/:id')
  updateSpecies(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateSpeciesDto>) {
    return this.service.updateSpecies(id, dto);
  }

  @Delete('species/:id')
  deleteSpecies(@Param('id', ParseIntPipe) id: number) { return this.service.deleteSpecies(id); }

  // SPECIES LEVEL
  @Get('species-level')
  getAllSpeciesLevels() { return this.service.getAllSpeciesLevels(); }

  @Post('species-level')
  createSpeciesLevel(@Body() dto: CreateSpeciesLevelDto) { return this.service.createSpeciesLevel(dto); }

  @Patch('species-level/:id')
  updateSpeciesLevel(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateSpeciesLevelDto>) {
    return this.service.updateSpeciesLevel(id, dto);
  }

  @Delete('species-level/:id')
  deleteSpeciesLevel(@Param('id', ParseIntPipe) id: number) { return this.service.deleteSpeciesLevel(id); }

  // SPECIES CATEGORY
  @Get('species-category')
  getAllSpeciesCategories() { return this.service.getAllSpeciesCategories(); }

  @Post('species-category')
  createSpeciesCategory(@Body() dto: CreateSpeciesCategoryDto) { return this.service.createSpeciesCategory(dto); }

  @Patch('species-category/:id')
  updateSpeciesCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateSpeciesCategoryDto>) {
    return this.service.updateSpeciesCategory(id, dto);
  }

  @Delete('species-category/:id')
  deleteSpeciesCategory(@Param('id', ParseIntPipe) id: number) { return this.service.deleteSpeciesCategory(id); }

  // SHOP ITEM TYPE
  @Get('shop-item-type')
  getAllShopItemTypes() { return this.service.getAllShopItemTypes(); }

  @Post('shop-item-type')
  createShopItemType(@Body() dto: CreateShopItemTypeDto) { return this.service.createShopItemType(dto); }

  @Patch('shop-item-type/:id')
  updateShopItemType(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateShopItemTypeDto>) {
    return this.service.updateShopItemType(id, dto);
  }

  @Delete('shop-item-type/:id')
  deleteShopItemType(@Param('id', ParseIntPipe) id: number) { return this.service.deleteShopItemType(id); }

  // SHOP ITEM
  @Get('shop-item')
  getAllShopItems() { return this.service.getAllShopItems(); }

  @Post('shop-item')
  createShopItem(@Body() dto: CreateShopItemDto) { return this.service.createShopItem(dto); }

  @Patch('shop-item/:id')
  updateShopItem(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateShopItemDto>) {
    return this.service.updateShopItem(id, dto);
  }

  @Delete('shop-item/:id')
  deleteShopItem(@Param('id', ParseIntPipe) id: number) { return this.service.deleteShopItem(id); }

  // QUEST TYPE
  @Get('quest-type')
  getAllQuestTypes() { return this.service.getAllQuestTypes(); }

  @Post('quest-type')
  createQuestType(@Body() dto: CreateQuestTypeDto) { return this.service.createQuestType(dto); }

  @Patch('quest-type/:id')
  updateQuestType(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateQuestTypeDto>) {
    return this.service.updateQuestType(id, dto);
  }

  @Delete('quest-type/:id')
  deleteQuestType(@Param('id', ParseIntPipe) id: number) { return this.service.deleteQuestType(id); }

  // QUEST
  @Get('quest')
  getAllQuests() { return this.service.getAllQuests(); }

  @Post('quest')
  createQuest(@Body() dto: CreateQuestDto) { return this.service.createQuest(dto); }

  @Patch('quest/:id')
  updateQuest(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateQuestDto>) {
    return this.service.updateQuest(id, dto);
  }

  @Delete('quest/:id')
  deleteQuest(@Param('id', ParseIntPipe) id: number) { return this.service.deleteQuest(id); }
}
