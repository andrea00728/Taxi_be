"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arret = void 0;
const typeorm_1 = require("typeorm");
const Ligne_js_1 = require("./Ligne.js"); // juste pour TypeScript
const districts_js_1 = require("./districts.js");
let Arret = class Arret {
};
exports.Arret = Arret;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Arret.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Arret.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Arret.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Arret.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Ligne', 'arrets'),
    __metadata("design:type", Ligne_js_1.Ligne)
], Arret.prototype, "ligne", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('District', 'arrets'),
    __metadata("design:type", districts_js_1.District)
], Arret.prototype, "districts", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Arret.prototype, "firebase_uid", void 0);
exports.Arret = Arret = __decorate([
    (0, typeorm_1.Entity)()
], Arret);
//# sourceMappingURL=Arret.js.map