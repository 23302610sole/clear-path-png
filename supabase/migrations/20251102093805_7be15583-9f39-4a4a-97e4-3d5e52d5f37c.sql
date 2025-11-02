-- Remove old departments that are no longer needed
DELETE FROM public.departments WHERE code IN ('SSFC', 'ACC');

-- Update existing departments
UPDATE public.departments SET name = 'The Catering Company' WHERE code = 'MESS';

-- Insert all the new academic departments
INSERT INTO public.departments (name, code, description) VALUES
  ('ATCDI Library', 'ATCDI', 'ATCDI Library Services'),
  ('Business Department', 'BUS', 'Business Department'),
  ('Business IT', 'BIT', 'Business Information Technology'),
  ('Architecture', 'ARCH', 'Architecture Department'),
  ('Construction Management', 'CM', 'Construction Management'),
  ('Communication Development Studies', 'CDS', 'Communication Development Studies'),
  ('Surveying', 'SURV', 'Surveying Department'),
  ('Geographical Instrumental Studies', 'GIS', 'Geographical Instrumental Studies'),
  ('Mining', 'MIN', 'Mining Engineering'),
  ('Mineral Processing', 'MP', 'Mineral Processing'),
  ('Electrical Engineering', 'EE', 'Electrical Engineering'),
  ('Mechanical Engineering', 'ME', 'Mechanical Engineering'),
  ('Biomedical Engineering', 'BME', 'Biomedical Engineering'),
  ('Food Technology', 'FT', 'Food Technology'),
  ('Applied Chemistry', 'ACHEM', 'Applied Chemistry'),
  ('Applied Physics', 'APHYS', 'Applied Physics'),
  ('Agriculture', 'AGR', 'Agriculture Department'),
  ('Mathematics and Computer Science', 'MCS', 'Mathematics and Computer Science'),
  ('Civil Engineering', 'CE', 'Civil Engineering')
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description;