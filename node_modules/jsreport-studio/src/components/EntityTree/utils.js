
export function checkIsGroupNode (node) {
  return node.isEntitySet === true || node.isGroup === true
}

export function checkIsGroupEntityNode (node) {
  if (checkIsGroupNode(node)) {
    return node.isEntity === true
  }

  return false
}

export function getNodeDOMId (entity) {
  let currentF = entity.folder
  let hierarchy = ''

  while (currentF != null) {
    hierarchy += `--${currentF.shortid}`
    currentF = currentF.folder
  }

  return `entityNode--${entity.__entitySet}--${entity.shortid}${hierarchy}`
}

export function getNodeTitleDOMId (entity) {
  const nodeDOMId = getNodeDOMId(entity)

  if (!nodeDOMId) {
    return undefined
  }

  return `${nodeDOMId}--title`
}

export function getAllEntitiesInHierarchy (node, includeRoot = false, onlyDirectChildren = false, allEntities) {
  const entities = allEntities == null ? [] : allEntities

  if (!node) {
    return entities
  }

  if (includeRoot === true) {
    if (checkIsGroupNode(node)) {
      if (checkIsGroupEntityNode(node)) {
        entities.push(node.data._id)
      }
    } else {
      entities.push(node.data._id)
    }
  }

  if (node.items) {
    node.items.forEach((cNode) => {
      const nodeToEvaluate = onlyDirectChildren === true ? Object.assign({}, cNode, { items: null }) : cNode

      return getAllEntitiesInHierarchy(nodeToEvaluate, true, false, entities)
    })
  }

  return entities
}
