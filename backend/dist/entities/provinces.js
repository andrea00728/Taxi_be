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
exports.Province = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const regions_js_1 = require("./regions.js");
let Province = class Province {
};
exports.Province = Province;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Province.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Province.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => regions_js_1.Region, (region) => region.province, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Province.prototype, "regions", void 0);
exports.Province = Province = __decorate([
    (0, typeorm_1.Entity)()
], Province);
//# sourceMappingURL=provinces.js.map