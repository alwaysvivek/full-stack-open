import { ALL_WRITERS, ALL_VOLUMES } from "./queries";

const uniqueVolumes = (volumes, newVolume) => {
    const titles = volumes.map(volume => volume.title);
    if (!titles.includes(newVolume.title)) {
        return [...volumes, newVolume];
    }
    return volumes;
}

export const updateVolumes = (cache, volume) => {
    const allVolumes = cache.readQuery({ query: ALL_VOLUMES })
    if (allVolumes) {
        const uniqueVolumesList = uniqueVolumes(allVolumes.allVolumes, volume)
        cache.writeQuery({
            query: ALL_VOLUMES,
            data: {
                allVolumes: uniqueVolumesList
            }
        })
    }

    const volumeGenres = [...volume.genres, ""]
    volumeGenres.forEach(volumeGenre => {
        const allVolumesByGenre = cache.readQuery({ query: ALL_VOLUMES, variables: { genre: volumeGenre } })
        if (allVolumesByGenre) {
            const uniqueVolumesList = uniqueVolumes(allVolumesByGenre.allVolumes, volume)
            cache.writeQuery({
                query: ALL_VOLUMES,
                variables: { genre: volumeGenre },
                data: {
                    allVolumes: uniqueVolumesList
                }
            })
        }
    })
}

export const updateWriters = (cache, volume) => {
    if (!volume.writer) {
        return
    }
    const allWriters = cache.readQuery({ query: ALL_WRITERS })
    if (allWriters?.allWriters) {
        const updatedWriters = [...allWriters.allWriters]
        const findWriterIndex = allWriters.allWriters.findIndex(a => a.name === volume.writer.name)
        if (findWriterIndex === -1) {
            updatedWriters.push(volume.writer)
        } else {
            updatedWriters[findWriterIndex] = { ...updatedWriters[findWriterIndex], volumeCount: volume.writer.volumeCount }
        }
        cache.writeQuery({
            query: ALL_WRITERS,
            data: {
                allWriters: updatedWriters
            }
        })
    }
}