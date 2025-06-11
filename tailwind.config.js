module.exports = {
  // clases que no han de ser eliminadas por tailwind 
  // hace referencia a clases que son calculadas en tiempo de ejecución
  safelist: [
    'grid-cols-1', 'grid-cols-2',
    'grid-cols-3', 'grid-cols-4',
    'grid-cols-5', 'grid-cols-6',
    'lg:grid-cols-1', 'lg:grid-cols-2',
    'lg:grid-cols-3', 'lg:grid-cols-4',
    'lg:grid-cols-5', 'lg:grid-cols-6',
   
  ],
  plugins: [
    require('@tailwindcss/typography'),
  ]
}