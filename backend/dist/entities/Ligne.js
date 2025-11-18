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
exports.Ligne = exports.StatutLigne = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const districts_js_1 = require("./districts.js");
var StatutLigne;
(function (StatutLigne) {
    StatutLigne["Attent"] = "Attent";
    StatutLigne["Accepted"] = "Accepted";
})(StatutLigne || (exports.StatutLigne = StatutLigne = {}));
let Ligne = class Ligne {
};
exports.Ligne = Ligne;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ligne.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ligne.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal"),
    __metadata("design:type", Number)
], Ligne.prototype, "tarif", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ligne.prototype, "depart", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ligne.prototype, "terminus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Arret', 'ligne', { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Ligne.prototype, "arrets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Itineraire', 'ligne', { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Ligne.prototype, "itineraires", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => districts_js_1.District, (district) => district.lignes, { onDelete: "CASCADE" }),
    __metadata("design:type", districts_js_1.District)
], Ligne.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: StatutLigne, default: StatutLigne.Attent }),
    __metadata("design:type", String)
], Ligne.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Ligne.prototype, "firebase_uid", void 0);
exports.Ligne = Ligne = __decorate([
    (0, typeorm_1.Entity)()
], Ligne);
//# sourceMappingURL=Ligne.js.map