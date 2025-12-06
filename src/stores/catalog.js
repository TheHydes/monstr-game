import { defineStore } from 'pinia'

import imgSmall  from '@/assets/Images/Shop/PotionsShop/SmallHealthPotion.png'
import imgMedium from '@/assets/Images/Shop/PotionsShop/MediumHealthPotion.png'
import imgLarge  from '@/assets/Images/Shop/PotionsShop/BigHealthPotion.png'

import imgBasicSword   from '@/assets/Images/Shop/WeaponShop/BasicSword.png'
import imgBasicAxe     from '@/assets/Images/Shop/WeaponShop/BasicAxe.png'
import imgPoisonDagger from '@/assets/Images/Shop/WeaponShop/PoisonDagger.png'
import imgIceAxe       from '@/assets/Images/Shop/WeaponShop/IceAxe.png'
import imgFlamingSword from '@/assets/Images/Shop/WeaponShop/FlamingSword.png'

import imgArmorBasic   from '@/assets/Images/Shop/ArmorShop/BasicArmor.png'
import imgArmorColored from '@/assets/Images/Shop/ArmorShop/ColoredArmor.png'
import imgArmorEpicB   from '@/assets/Images/Shop/ArmorShop/EpicBlueArmor.png'
import imgArmorEpicR   from '@/assets/Images/Shop/ArmorShop/EpicRedArmor.png'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    weapons: [
      { id: 'w_basic_sword',   name: 'Basic Sword',   dmgPct: 0.10, critPct: 0.03, firePct: 0,    img: imgBasicSword,   price: 20 },
      { id: 'w_basic_axe',     name: 'Basic Axe',     dmgPct: 0.15, critPct: 0.05, firePct: 0,    img: imgBasicAxe,     price: 50 },
      { id: 'w_poison_dagger', name: 'Poison Dagger', dmgPct: 0.25, critPct: 0.45, firePct: 0,    img: imgPoisonDagger, price: 150 },
      { id: 'w_ice_axe',       name: 'Ice Axe',       dmgPct: 0.50, critPct: 0.35, firePct: 0,    img: imgIceAxe,       price: 350 },
      { id: 'w_flaming_sword', name: 'Flaming Sword', dmgPct: 0.50, critPct: 0.45, firePct: 0.15, img: imgFlamingSword, price: 750 },
    ],
    armors: [
      { id: 'a_basic',    name: 'Basic Armor',   hpScalePct: 0.08, drPct: 0.06, img: imgArmorBasic,   price: 60 },
      { id: 'a_colored',  name: 'Colored Armor', hpScalePct: 0.18, drPct: 0.15, img: imgArmorColored, price: 135 },
      { id: 'a_epic_blue',name: 'Epic Blue',     hpScalePct: 0.20, drPct: 0.40, img: imgArmorEpicB,   price: 240 },
      { id: 'a_epic_red', name: 'Epic Red',      hpScalePct: 0.50, drPct: 0.35, img: imgArmorEpicR,   price: 450 },
    ],
    potions: [
      { id: 'p_small',  name: 'Small Health Potion',  healPct: 0.25, img: imgSmall,  price: 9  },
      { id: 'p_medium', name: 'Medium Health Potion', healPct: 0.50, img: imgMedium, price: 16 },
      { id: 'p_large',  name: 'Large Health Potion',  healPct: 1.00, img: imgLarge,  price: 30 },
    ],
  }),
  getters: {
    weaponById: (s) => (id) => s.weapons.find(w => w.id === id),
    armorById:  (s) => (id) => s.armors.find(a => a.id === id),
    potionById: (s) => (id) => s.potions.find(p => p.id === id),
  },
})
