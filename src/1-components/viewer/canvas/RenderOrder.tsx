import React from "react";
import { useFrame } from "@react-three/fiber";
import { Matrix4, Mesh, Object3D, PerspectiveCamera } from "three";

/**
 * traverse through the whole scene graph and set correct renderOrders to all meshes based on their distances from the camera.
 * also keep track of all the renderOrder <> camera distances used
 * @constructor
 */
export const RenderOrder = () => {
  // ! DONOT DELETE - FOR DEBUGGING PURPOSES
  // const currentSceneId = useCurrentSceneStore(s => s.currentSceneId);
  // let i = 0;
  // useEffect(() => {
  //   i = 0;
  // }, [currentSceneId]);

  function getNodesForRenderOrderCompute(node: Object3D) {
    const nodesForRenderOrder: Object3D[] = [];
    node.traverse((child) => {
      if(child instanceof Mesh && child.userData.needsRenderOrder && child.material.transparent) {
        nodesForRenderOrder.push(child);
      }
    });
    return [nodesForRenderOrder];
  }

  function getNodeDistanceMap(nodes: Object3D[], camera: PerspectiveCamera) {
    const nodeDistanceMap: Record<number, Object3D[]> = {};
    for(const n of nodes) {
      const dist = n.userData.renderDistance? n.userData.renderDistance: matrixDistance(n.matrixWorld, camera.matrixWorld);
      nodeDistanceMap[dist]? nodeDistanceMap[dist].push(n): nodeDistanceMap[dist] = [n];
    }
    return nodeDistanceMap;
  }

  function applyRenderOrderToNodes(nodesMap: Record<number, Object3D[]>, sortedOrder: number[]) {
    let renderOrder = 1;
    for(const o of sortedOrder) {
      for(const n of nodesMap[o]) {
        n.renderOrder = ++renderOrder;
        // after applying renderOrder once, skip this until the mesh is re-created
        // n.userData.needsRenderOrder = false;
      }
    }
  }

  useFrame(({scene, camera}) => {
    const [nodesForRenderOrder] = getNodesForRenderOrderCompute(scene);
    const ndm = getNodeDistanceMap(nodesForRenderOrder, camera as PerspectiveCamera);
    const ndmo = Object.keys(ndm).map(k => Number(k)).sort((a, b) => b - a).filter(a => a);
    applyRenderOrderToNodes(ndm, ndmo);

    // ! DONOT DELETE - FOR DEBUGGING PURPOSES
    /*if(Object.keys(ndm).length && i === 100) {
      console.log(ndm);
    }
    ++i;*/
  });

  return null;
};

function matrixDistance(matrixA: Matrix4, matrixB: Matrix4) {
  const x = matrixA.elements[12] - matrixB.elements[12];
  const y = matrixA.elements[13] - matrixB.elements[13];
  const z = matrixA.elements[14] - matrixB.elements[14];
  return Math.sqrt(x * x + y * y + z * z);
}