(function(){
    if(!cc.Sprite.__assembler__.Tiled3D) return;

    let proto = cc.Sprite.__assembler__.Tiled3D.prototype;

    Object.assign(proto, { 
        updateWorldVerts (sprite) {
            let local = this._local;
            let localX = local.x, localY = local.y;
            let world = this._renderData.vDatas[0];
            let { row, col } = this;
            let x, x1, y, y1;
            let vertexOffset = 0;
            for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
                y = localY[yindex];
                y1 = localY[yindex + 1];
                for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                    x = localX[xindex];
                    x1 = localX[xindex + 1];

                    // left bottom
                    let padding = 6;
                    world[vertexOffset] = x;
                    world[vertexOffset + 1] = y;
                    world[vertexOffset + 2] = 0;
                    vertexOffset += padding;

                    // right bottom
                    world[vertexOffset] = x1;
                    world[vertexOffset + 1] = y;
                    world[vertexOffset + 2] = 0;
                    vertexOffset += padding;

                    // left top
                    world[vertexOffset] = x;
                    world[vertexOffset + 1] = y1;
                    world[vertexOffset + 2] = 0;
                    vertexOffset += padding;

                    // right top
                    world[vertexOffset] = x1;
                    world[vertexOffset + 1] = y1;
                    world[vertexOffset + 2] = 0; 
                    vertexOffset += padding;
                }
            }
        }
    })
})()