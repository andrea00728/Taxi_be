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
exports.Itineraire = void 0;
const typeorm_1 = require("typeorm");
const Ligne_js_1 = require("./Ligne.js");
require("reflect-metadata");
let Itineraire = class Itineraire {
};
exports.Itineraire = Itineraire;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Itineraire.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Itineraire.prototype, "depart", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Itineraire.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Itineraire.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Itineraire.prototype, "duree", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Itineraire.prototype, "tarif", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Ligne_js_1.Ligne, (ligne) => ligne.itineraires, { onDelete: "CASCADE" }),
    __metadata("design:type", Ligne_js_1.Ligne)
], Itineraire.prototype, "ligne", void 0);
exports.Itineraire = Itineraire = __decorate([
    (0, typeorm_1.Entity)()
], Itineraire);
//# sourceMappingURL=Itineraire.js.map