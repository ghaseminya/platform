/* -*- Mode: C; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 *
 * The contents of this file are subject to the Netscape Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/NPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is Netscape
 * Communications Corporation.  Portions created by Netscape are
 * Copyright (C) 1998 Netscape Communications Corporation. All
 * Rights Reserved.
 *
 * Contributor(s): 
 */
/* 
 * DO NOT EDIT THIS DOCUMENT MANUALLY !!!
 * THIS FILE IS AUTOMATICALLY GENERATED BY THE TOOLS UNDER
 *    AutoDetect/tools/
 */

package org.exoplatform.services.parser.chardet ;


public class GB2312Verifier extends Verifier {

  public GB2312Verifier() {

    cclass = new int[256/8] ;

    cclass[0] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[1] = ((((  ((((  (((( 0) << 4) | (0)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[2] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[3] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((0) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[4] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[5] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[6] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[7] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[8] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[9] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[10] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[11] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[12] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[13] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[14] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[15] = ((((  ((((  (((( 1) << 4) | (1)))  ) << 8) | (((((1) << 4) | ( 1))) ))) ) << 16) | (  ((((  ((((1) << 4) | (1))) ) << 8) | (   ((((1) << 4) | (1))) )))))) ;
    cclass[16] = ((((  ((((  (((( 0) << 4) | (0)))  ) << 8) | (((((0) << 4) | ( 0))) ))) ) << 16) | (  ((((  ((((0) << 4) | (0))) ) << 8) | (   ((((0) << 4) | (0))) )))))) ;
    cclass[17] = ((((  ((((  (((( 0) << 4) | (0)))  ) << 8) | (((((0) << 4) | ( 0))) ))) ) << 16) | (  ((((  ((((0) << 4) | (0))) ) << 8) | (   ((((0) << 4) | (0))) )))))) ;
    cclass[18] = ((((  ((((  (((( 0) << 4) | (0)))  ) << 8) | (((((0) << 4) | ( 0))) ))) ) << 16) | (  ((((  ((((0) << 4) | (0))) ) << 8) | (   ((((0) << 4) | (0))) )))))) ;
    cclass[19] = ((((  ((((  (((( 0) << 4) | (0)))  ) << 8) | (((((0) << 4) | ( 0))) ))) ) << 16) | (  ((((  ((((0) << 4) | (0))) ) << 8) | (   ((((0) << 4) | (0))) )))))) ;
    cclass[20] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (0))) )))))) ;
    cclass[21] = ((((  ((((  (((( 3) << 4) | (3)))  ) << 8) | (((((3) << 4) | ( 3))) ))) ) << 16) | (  ((((  ((((3) << 4) | (3))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[22] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[23] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[24] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[25] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[26] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[27] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[28] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[29] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[30] = ((((  ((((  (((( 2) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;
    cclass[31] = ((((  ((((  (((( 0) << 4) | (2)))  ) << 8) | (((((2) << 4) | ( 2))) ))) ) << 16) | (  ((((  ((((2) << 4) | (2))) ) << 8) | (   ((((2) << 4) | (2))) )))))) ;

    states = new int[2] ;

    states[0] = ((((  ((((  (((( eError) << 4) | (eError)))  ) << 8) | (((((eError) << 4) | ( eError))) ))) ) << 16) | (  ((((  ((((eError) << 4) | (     3))) ) << 8) | (   ((((eStart) << 4) | (eError))) )))))) ;
    states[1] = ((((  ((((  (((( eStart) << 4) | (eStart)))  ) << 8) | (((((eError) << 4) | ( eError))) ))) ) << 16) | (  ((((  ((((eItsMe) << 4) | (eItsMe))) ) << 8) | (   ((((eItsMe) << 4) | (eItsMe))) )))))) ;

    charset =  "GB2312";
    stFactor =  4;

  }

}
