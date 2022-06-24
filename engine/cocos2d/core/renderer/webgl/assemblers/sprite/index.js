import Assembler from '../../../assembler';
import { Type, FillType } from '../../../../components/CCSprite';

import Simple from "./2d/simple";
import Sliced from "./2d/sliced";
import Tiled from "./2d/tiled";
import RadialFilled from "./2d/radial-filled";
import BarFilled from "./2d/bar-filled";
import Mesh from './2d/mesh';

import Simple3D from "./3d/simple";
import Sliced3D from "./3d/sliced";
import Tiled3D from "./3d/tiled";
import RadialFilled3D from "./3d/radial-filled";
import BarFilled3D from "./3d/bar-filled";
import Mesh3D from './3d/mesh';

import SimpleMulti from "./2d-multi/simple";
import SlicedMulti from "./2d-multi/sliced";
import TiledMulti from "./2d-multi/tiled";
import RadialFilledMulti from "./2d-multi/radial-filled";
import BarFilledMulti from "./2d-multi/bar-filled";
import MeshMulti from "./2d-multi/mesh";

let ctor = {
    getConstructor(sprite) {
        let is3DNode = sprite.node.is3DNode;
        const material = sprite.getMaterials()[0];
        let isMultiMaterial = material && material.material.isMultiSupport();

        let ctor = is3DNode ? Simple3D : (isMultiMaterial ? SimpleMulti : Simple);
        switch (sprite.type) {
            case Type.SLICED:
                ctor = is3DNode ? Sliced3D : (isMultiMaterial ? SlicedMulti : Sliced);
                break;
            case Type.TILED:
                ctor = is3DNode ? Tiled3D : (isMultiMaterial ? TiledMulti : Tiled);
                break;
            case Type.FILLED:
                if (sprite._fillType === FillType.RADIAL) {
                    ctor = is3DNode ? RadialFilled3D : (isMultiMaterial ? RadialFilledMulti : RadialFilled);
                } else {
                    ctor = is3DNode ? BarFilled3D : (isMultiMaterial ? BarFilledMulti : BarFilled);
                }
                break;
            case Type.MESH:
                ctor = is3DNode ? Mesh3D : (isMultiMaterial ? MeshMulti : Mesh);
                break;
        }

        return ctor;
    },

    Simple,
    Sliced,
    Tiled,
    RadialFilled,
    BarFilled,
    Mesh,

    Simple3D,
    Sliced3D,
    Tiled3D,
    RadialFilled3D,
    BarFilled3D,
    Mesh3D,

    SimpleMulti,
    SlicedMulti,
    TiledMulti,
    RadialFilledMulti,
    BarFilledMulti,
    MeshMulti,
};

Assembler.register(cc.Sprite, ctor);
