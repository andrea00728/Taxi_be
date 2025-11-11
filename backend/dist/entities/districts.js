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
exports.District = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const regions_js_1 = require("./regions.js");
const Ligne_js_1 = require("./Ligne.js");
let District = class District {
};
exports.District = District;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], District.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], District.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => regions_js_1.Region, (region) => region.districts, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "region_id" }),
    __metadata("design:type", regions_js_1.Region)
], District.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ligne_js_1.Ligne, (ligne) => ligne.district),
    __metadata("design:type", Array)
], District.prototype, "lignes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Arret', 'districts'),
    __metadata("design:type", Array)
], District.prototype, "arrets", void 0);
exports.District = District = __decorate([
    (0, typeorm_1.Entity)()
], District);
//# sourceMappingURL=districts.js.map