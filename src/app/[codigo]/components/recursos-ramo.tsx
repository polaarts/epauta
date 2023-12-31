'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter } from 'next/navigation'
import RecursosCard from '@/app/components/recursos/recursos-card'
import Link from 'next/link'
import { useState } from 'react'

const RecursosRamo = ({ recursos, ramos, grid, id }: { recursos: Recursos, ramos: Ramos, grid: number, id: string | undefined }) => {
  const pathname = usePathname()
  const router = useRouter()
  const codigo = pathname.split('/')[1]
  const [open, setOpen] = useState(false)
  const supabase = createClientComponentClient()
  const [tipoError, setTipoError] = useState<string | null>(null)
  const [anioError, setAnioError] = useState<string | null>(null)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [tagsError, setTagsError] = useState<string | null>(null)

  const toggle = () => { setOpen(!open) }

  const recursosListHandler = async () => {
    setTipoError(null)
    setAnioError(null)
    setUrlError(null)
    setTagsError(null)

    const tipo = (document.getElementById('tipo') as HTMLInputElement).value
    const anio = (document.getElementById('anio') as HTMLInputElement).value
    const semestre = (document.getElementById('semestre') as HTMLInputElement).value
    const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value
    const url = (document.getElementById('url') as HTMLInputElement).value
    const tags = (document.getElementById('tags') as HTMLInputElement).value
    const ramo = codigo
    const user = id

    let isValid = true

    if (tipo.trim() === '' || tipo.trim() === null) {
      setTipoError('El tipo es obligatorio.')
      isValid = false
    }

    if (anio.trim() === '' || anio.trim() === null) {
      setAnioError('El año es obligatorio.')
      isValid = false
    }

    if (url.trim() === '' || url.trim() === null) {
      setUrlError('La URL es obligatoria.')
      isValid = false
    }

    if (tags.trim() === '' || tags.trim() === null) {
      setTagsError('Los tags son obligatorios.')
      isValid = false
    }
    if (isValid) {
      // Si todos los campos son válidos, procede con la inserción de recursos
      const recursosList = [{ tipo, anio, url, tags, ramo, user, semestre, descripcion }]

      try {
        const { error } = await supabase.from('recursos').insert(recursosList)
        router.refresh()
        if (error != null) {
          console.error('Error al insertar recursos:', error)
          console.log(recursosList, 'con error')
        } else {
          console.log('Recursos insertados exitosamente:', recursosList)
          // Puedes realizar alguna acción aquí, como actualizar el estado o mostrar un mensaje de éxito
        }
      } catch (error) {
        console.error('Error en la solicitud:', error)
      }
      setOpen(false)
    }
  }

  const material = recursos?.filter((recurso) => recurso.ramo === codigo)
  console.log(material)
  const ramo = ramos?.find((ramo) => ramo.codigo === codigo)?.nombre
  return (
    <main className="flex flex-col">
      <div className='flex flex-row gap-x-2'>
        <Link href={'/'}>
          <h1 className='text-2xl font-bold mb-3 text-white'>ePAUTA</h1>
        </Link>
        <h3 className='uppercase text-2xl font-light mb-3 text-white'>- {ramo}</h3>
      </div>
      {!open
        ? (

          <button onClick={toggle} className='bg-white border border-black w-full p-3 rounded mb-4 text-red-500 uppercase hover:shadow-lg mx-auto'>Agregar recurso</button>
          )
        : (

          <button onClick={toggle} className='bg-white border border-black w-full p-3 rounded mb-4 text-red-500 uppercase hover:shadow-lg mx-auto'>Ocultar</button>
          )}

      {open && (
        <div className='bg-white p-4 mb-4 rounded border border-black'>
          {/* <div className='flex justify-between'>
            <div className='flex space-x-2'>
              <button onClick={() => { setCtdInput(ctdInput + 1) }} className='flex space-x-2 hover:bg-gray-100 p-1 rounded'><PlusIcon /></button>
              {ctdInput > 1 && <button onClick={() => { setCtdInput(ctdInput - 1) }} className='flex space-x-2 hover:bg-gray-100 p-1 rounded'><MinusIcon /></button>}
            </div>
            <button onClick={toggle} className='hover:bg-gray-100 p-1 rounded'><XIcon /></button>
          </div> */}
          <div className='m-2'>
            <div className='flex flex-col space-y-2'>
              <small>* Todos los campos son obligatorios a excepcion de la descripcion, sino no se creará el recurso.</small>
              <small>** El tipo de recurso debe ser Control, Ayudantia, Solemne, Examen u Otro.</small>
            </div>
            <div className='space-y-4 p-3 my-3 bg-gray-100 rounded'>
              <input
                type='text'
                name='tipo'
                id='tipo'
                placeholder='* **Tipo y versión. Ej: Control 3, Examen.'
                className={`w-full border p-2 bg-white border-black rounded ${tipoError !== null && tipoError !== undefined ? 'border-red-500' : ''
                  }`}
              />
              {tipoError !== null && tipoError !== undefined && <p className='text-red-500'>{tipoError}</p>}

              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='number'
                  name='anio'
                  placeholder='*Año'
                  id='anio'
                  className={`border p-2 bg-white border-black rounded ${tipoError !== null && tipoError !== undefined ? 'border-red-500' : ''
                    }`}
                />

                <select name='semestre' id='semestre' className='border border-black rounded p-2 bg-white'>
                  <option value='1'>Primer semestre</option>
                  <option value='2'>Segundo semestre</option>
                  <option value='3'>Verano</option>
                </select>
              </div>

              {anioError !== null && anioError !== undefined && <p className='text-red-500'>{anioError}</p>}
              <textarea name='descripcion' placeholder='Descripción' id='descripcion' className='border border-black rounded p-2 bg-white w-full' />
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='url'
                  name='url'
                  placeholder='*URL'
                  id='url'
                  className={`border p-2 bg-white border-black rounded ${tipoError !== null && tipoError !== undefined ? 'border-red-500' : ''
                    }`}
                />
                <input
                  type='text'
                  name='tags'
                  placeholder='*Tags separados por coma. Ej: "Enunciado, pauta"'
                  id='tags'
                  className={`border p-2 bg-white border-black rounded ${tipoError !== null && tipoError !== undefined ? 'border-red-500' : ''
                    }`}
                />
              </div>
              {urlError !== null && urlError !== undefined && <p className='text-red-500'>{urlError}</p>}
              {tagsError !== null && tagsError !== undefined && <p className='text-red-500'>{tagsError}</p>}
            </div>

            <button onClick={recursosListHandler} className='hover:bg-gray-200 bg-gray-100 w-full p-3 rounded text-black uppercase'>Agregar</button>
          </div>
        </div>
      )}

      <div className={`grid lg:grid-cols-${grid} md:grid-cols-${grid - 1} grid-cols-${grid - 2} gap-4`}>
        {material?.map((recurso) => (
          <RecursosCard key={recurso.id} recurso={recurso} />
        ))}
      </div>
    </main>
  )
}

export default RecursosRamo
